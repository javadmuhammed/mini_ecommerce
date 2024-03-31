

let mongoose = require("mongoose");


let AdminModel = new mongoose.Schema(
    {
        username: String,
        password: String
    }
)

let adminDb = mongoose.model("Admin", AdminModel, "admin")
module.exports = adminDb;
