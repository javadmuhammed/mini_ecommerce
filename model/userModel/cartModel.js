let mongoose = require("mongoose");

let cartScheme = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    products: [
        {
            product_id: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            }
        }
    ]
})


let cartModel = mongoose.model("cart", cartScheme, "cart")
module.exports = cartModel;