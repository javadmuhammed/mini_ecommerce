
let productModel = require("../model/common/productModel")
let UserModel = require("../model/userModel/userModel")
let path = require("path");
const userCollction = require("../model/userModel/userModel");


let commonHelper = {


    getAllProduct: async function (query) {
        let data = await productModel.find(query).exec();
        return data;
    },

    getLimitedProduct: async function (req, limit, isActivedOnly) {
        let filtter = {};
        if (req.query.status) {
            filtter["status"] = (req.query.status == "active") ? "UNBLOCK" : "BLOCK";
        }


        if (isActivedOnly) {
            filtter["status"] = { $eq: "UNBLOCK" };
        }

        console.log(filtter)

        let data = await productModel.find(filtter).limit(limit).exec();


        return data;
    },


    addNewUser: async function (userObject, files) {
        return new Promise(function (resolve, reject) {
            files.mv(path.join(__dirname, "../public/user_profile/" + userObject.dp), async function (err, data) {
                if (err) {
                    reject()
                } else {
                    let user = new UserModel(userObject);
                    let saveUser = await user.save()
                    resolve(saveUser);
                }
            })
        })
    },



    getSingleUser: function (user_id) {
        return new Promise(function (resolve, reject) {
            userCollction.findById(user_id).then(function (data) {
                resolve(data)
            }).catch(function (err) {
                reject(err)
            })
        })
    }
}


module.exports = commonHelper;