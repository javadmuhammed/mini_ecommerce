

let moongose = require("mongoose");

let UserModel = new moongose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        lastLoggin: String,
        dp: String,
        role: String,
        location: String,
        password:String,
        block:String
    }
)

let userCollction = moongose.model("user", UserModel, "user")
 

module.exports=userCollction