var express = require("express"); // Requires the Express module
var cors = require("cors");

// Calls the express function to start a New Express application
var app = express();

app.use(cors());

// Lessons data (without image files)
    var lessonsArray = [
    
    // Computer Science lesson
    {
        id: 1001, // Lesson ID.
        subject: "Computer Science",
        location: "Location: Hendon",
        price: 50,
        availableSlot: 5 // This availability field tracks available slots for purchase.
    },

    // Sport lesson
    {
        id: 1002, // Lesson ID.
        subject: "Sport",
        location: "Location: Hendon",
        price: 50,
        availableSlot: 5 // This availability field tracks available slots for purchase.
    },

    // French lesson
    {
        id: 1003, // Lesson ID.
        subject: "French",
        location: "Location: Hendon",
        price: 50,
        availableSlot: 5 // This availability field tracks available slots for purchase.
    },

    // Art lesson
    {
        id: 1004, // Lesson ID.
        subject: "Art",
        location: "Location: Hendon",
        price: 50,
        availableSlot: 5 // This availability field tracks available slots for purchase.
    },

    // History lesson
    {
        id: 1005, // Lesson ID.
        subject: "History",
        location: "Location: Hendon",
        price: 50,
        availableSlot: 5 // This availability field tracks available slots for purchase.
    }
];

// Returns lessons data as JSON
app.get("/", function (request, response) {
    response.json(lessonsArray);
});

// Start the server
app.listen(3000, function() {
    console.log("App started on port 3000");
});



