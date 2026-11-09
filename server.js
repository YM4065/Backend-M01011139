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

// Connect to the After School Lesson database
const db = client.db("AfterSchoolLesson");

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
connectToMongoDB();

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
        image: "http://localhost:3000/images/ComputerScience.jpg"
    },

    // Sport lesson
    {
        id: 1002, // Lesson ID.
        subject: "Sport",
        location: "Location: Hendon",
        price: 10,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "http://localhost:3000/images/Sport.jpg"
    },

    // French lesson
    {
        id: 1003, // Lesson ID.
        subject: "French",
        location: "Location: Hendon",
        price: 15,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "http://localhost:3000/images/French.jpg"
    },

    // Art lesson
    {
        id: 1004, // Lesson ID.
        subject: "Art",
        location: "Location: Hendon",
        price: 20,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "http://localhost:3000/images/Art.jpg"
    },

    // History lesson
    {
        id: 1005, // Lesson ID.
        subject: "History",
        location: "Location: Hendon",
        price: 25,
        availableSlot: 5, // This availability field tracks available slots for purchase.
        image: "http://localhost:3000/images/History.jpg"
    }
];

// GET /lessons route that gets the lesson data from the database
app.get("/lessons", async function(request, response) {
    let collection = await db.collection("lessons");
    let results = await collection.find({}).toArray();
    response.send(results);
});

// Static File middleware that returns a requested image
app.use("/images", express.static("staticFiles"));

// Middleware to return an error if the requested image does not exist
app.use("/images", function(request, response) {
    response.status(404).send("Image not found!");
});

// POST route that sends order information to the Orders table
app.post("/orders", async function(request, response) {
    var body = request.body;
    let collection = await db.collection("orders");
    let result = await collection.insertOne(body);
    response.send(result);
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

// Final middleware route that returns a 404 error if an unrecognised request comes in to the server
app.use(function(request, response) {
    response.status(404).send("Page not found!");
});

// Start the server
app.listen(3000, function() {
    console.log("App started on port 3000");
});



