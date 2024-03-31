
 
let adminModel = require("../model/adminModel/adminModel")
let ProductModel = require("../model/common/productModel")
let path = require("path");
const userCollction = require("../model/userModel/userModel");
let mongoose = require("mongoose");

let adminHelper = {
    adminLoginValidation: async function (data) {
        let adminCreditials = await adminModel.find({ username: data.username, password: data.password })
        if (adminCreditials.length == 0) {
            return false
        } else {
            return true;
        }
    },


    getAdminData: async function () {
        let product = await ProductModel.find().limit(12);
        let countProduct = await ProductModel.find().count();
        let usersCount = await userCollction.find().count();

        let adminData = {
            userCount: usersCount,
            productCount: countProduct,
            products: product
        };

        return adminData;
    },

    addProduct: async (prdData) => {

        let imageName = prdData.files.name
        let status = false;


        await prdData.files.mv(path.join(__dirname, "../public/productImage/" + imageName), function (err, data) {
            if (err) {
                console.log(err);
                return false;
            }

            console.log(prdData);
            let productData = {
                product_name: prdData.product_name,
                price: prdData.price,
                discount: prdData.discount,
                tax: prdData.tax,
                product_image: prdData.files.name,
                status:"UNBLOCK"
            }

            console.log(productData);

            let insertProduct = new ProductModel(productData)
            insertProduct.save().then(function () {
                status = true;
            })

        })

        return status;
    },


    editProduct: async function (editId, prdData) {

        let productData = {
            product_name: prdData.product_name,
            price: prdData.price,
            discount: prdData.discount,
            tax: prdData.tax,
        }

        return new Promise(async function (resolve, reject) {

            if (prdData.files) {
                let imageName = prdData.files.name

                await prdData.files.mv(path.join(__dirname, "../public/productImage/" + imageName), function (err, data) {
                    if (err) {
                        reject(err)
                    }
                })

                productData["product_image"] = imageName
            }


            ProductModel.updateOne(
                {
                    '_id': new mongoose.Types.ObjectId(editId),
                    
                },
                {
                    $set: productData
                }
            ).then(function (data) {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })


    },

    deleteProducts: async function (id) {
        let data = await ProductModel.deleteMany({ "_id": { $in: id } })
        return data;
    },

    updateProductStatus: async function (id, type) {
        let data = await ProductModel.updateMany({ _id: { $in: id } }, { $set: { "status": type } })
        console.log(data);
        return data;
    },


    getProductById: async function (id) {
        let data = await ProductModel.findById(id);
        return data;
    },


    getAllUsers: async function (filtter) {
        let data = await userCollction.find(filtter);
        return data;
    },

    deleteUsers: async function (user_ids) {
        let deleteUsers = await userCollction.deleteMany({ _id: { $in: user_ids } })
        return deleteUsers;
    },


    updateUserStatus: async function (user_id, status) {
        let updateUsers = await userCollction.updateMany(
            {
                _id: user_id
            },
            {
                $set: {
                    "block": status
                }
            }
        )

        return updateUsers
    }
}


module.exports = adminHelper;