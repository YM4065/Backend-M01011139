var express = require("express"); // Requires the Express module
var cors = require("cors");
var path = require("path");

// Loads the configuration from config.env to process.env
require("dotenv").config({ path: "./config.env" });

// MongoDB connection setup
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_PREFIX + process.env.MONGODB_USERNAME + ":" + 
process.env.MONGODB_PASSWORD + process.env.MONGODB_URL;
const client = new MongoClient(uri);

// Render connection setup
const port = process.env.PORT||3000;

// Connect to the After School Lesson database
const db = client.db("AfterSchoolLesson");

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");

        // Insert missing lessons into MongoDB
        await insertLessons();

        // Start the server after MongoDB is ready
        app.listen(port, function() {
            console.log("App started on port " + port);
        });

    } catch (err) {
        console.error("Unable to connect to MongoDB:", err);
    }
}

// Calls the express function to start a New Express application
var app = express();

app.use(cors());
app.use(express.json());

// ‘logger’ middleware that writes information about any incoming request to the console
app.use(function(request, response, next) {
    console.log("Incoming " + request.method + " request to " + request.url);
    next();
});

var lessonsArray = [
    
    // Computer Science lesson
    {
        id: 1001, // Lesson ID.
        subject: "Computer Science",
        location: "Location: Hendon",
        price: 5,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/ComputerScience.jpg"
    },

    // Sport lesson
    {
        id: 1002, // Lesson ID.
        subject: "Sport",
        location: "Location: Hendon",
        price: 10,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/Sport.jpg"
    },

    // French lesson
    {
        id: 1003, // Lesson ID.
        subject: "French",
        location: "Location: Hendon",
        price: 15,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/French.jpg"
    },

    // Art lesson
    {
        id: 1004, // Lesson ID.
        subject: "Art",
        location: "Location: Hendon",
        price: 20,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/Art.jpg"
    },

    // History lesson
    {
        id: 1005, // Lesson ID.
        subject: "History",
        location: "Location: Hendon",
        price: 25,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/History.jpg"
    },

    // Spanish lesson
    {
        id: 1006, // Lesson ID.
        subject: "Spanish",
        location: "Location: Hendon",
        price: 30,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/Spanish.jpg"
    },

    // German lesson
    {
        id: 1007, // Lesson ID.
        subject: "German",
        location: "Location: Hendon",
        price: 35,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/German.jpg"
    },

    // English Literature lesson
    {
        id: 1008, // Lesson ID.
        subject: "English Literature",
        location: "Location: Hendon",
        price: 40,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/EnglishLiterature.jpg"
    },

    // Maths lesson
    {
        id: 1009, // Lesson ID.
        subject: "Maths",
        location: "Location: Hendon",
        price: 45,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/Maths.jpg"
    },

    // Geography lesson
    {
        id: 1010, // Lesson ID.
        subject: "Geography",
        location: "Location: Hendon",
        price: 50,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "https://backend-m01011139.onrender.com/images/Geography.jpg"
    }
];

// Automatically insert missing lessons and update existing lesson information
async function insertLessons() {
    try {
        let collection = db.collection("lessons");

        for (const lesson of lessonsArray) {

            await collection.updateOne(
                { id: lesson.id }, // Check using the lesson ID

                {
                    // Update existing lesson information
                    $set: {
                        subject: lesson.subject,
                        location: lesson.location,
                        price: lesson.price,
                        image: lesson.image
                    },

                    // Set availability only when inserting a new lesson
                    $setOnInsert: {
                        availableSlot: lesson.availableSlot
                     }
                },

                { upsert: true }
            );
        }

            console.log("All 10 lessons successfully updated in MongoDB!");

    } catch (error) {
        console.error("Error inserting lessons:", error);
    }
}

// GET /lessons route that gets the lesson data from the database
app.get("/lessons", async function(request, response) {
    let collection = await db.collection("lessons");
    let results = await collection.find({}).toArray();
    response.send(results);
});

// Static File middleware that returns a requested image
app.use("/images", express.static(path.join(__dirname, "staticFiles")));

// Middleware to return an error if the requested image does not exist
app.use("/images", function(request, response) {
    response.status(404).send("Image not found!");
});

// POST route that sends order information to the Orders table
app.post("/orders", async function(request, response){
    var body = request.body;
    let collection = await db.collection("orders");
    let result = await collection.insertOne(body);
    response.send(result);
    console.log(result);
});

// PUT /lessons/ route to server.js that will update information about an exising lesson in the database
app.put("/lessons/:_id", async function(request, response) {
    try {
        var body = request.body;
        let collection = await db.collection("lessons");
        let tempid = request.params._id;

        const query = { _id: new ObjectId(tempid) };
        
        const updates = {
            $set: request.body
    };

    const result = await collection.updateOne(query, updates);

    response.send(result);

    } catch (error) {
        console.error("Error updating lesson:", error);
        response.status(500).send("Unable to update lesson")
    }
});

// Add and delete orders
app.delete("/orders/:id", async function (req, res) {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("orders");
    let result = await collection.deleteOne(query);
    console.log(result);
    res.send(result).status(200);
});

// Final middleware route that returns a 404 error if an unrecognised request comes in to the server
app.use(function(request, response) {
    response.status(404).send("Page not found!");
});

// Connect to MongoDB and start the server
connectToMongoDB();



