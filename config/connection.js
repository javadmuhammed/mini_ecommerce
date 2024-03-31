

let mongoose = require("mongoose");

// let db = mongoose.connect("mongodb://127.0.0.1/mini_ecommerce");
// let db = mongoose.connect("mongodb://mini-ecom-mongo:27017/mini_ecommerce");
let db = mongoose.connect("mongodb+srv://testettestet1as:y1kbRI11BslNImPo@cluster0.mjj2fgh.mongodb.net/");


db.then(function () {
    console.log("Database connected successfull");
}).catch(function () {
    console.log("Database connection failed");
})
 




