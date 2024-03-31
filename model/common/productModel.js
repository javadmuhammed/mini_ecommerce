
let mongoose = require("mongoose")



                
let Product = new mongoose.Schema({
    product_name: String,
    product_image: String,
    price: String,
    discount: String,
    tax: String,
    status: String,
})

let productCollection = mongoose.model("product", Product, "product")
module.exports = productCollection;