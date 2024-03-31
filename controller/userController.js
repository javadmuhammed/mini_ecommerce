
const { default: mongoose } = require("mongoose");
let commonHelper = require("../helper/commonHelper")
let userHelper = require("../helper/userHelper");
let productModel = require("../model/common/productModel");
const cartModel = require("../model/userModel/cartModel");

function isLogged(req) {
    return (req.session.user) ? true : false;
}

let userController = {
    userSignUp: function (req, res) {

        let imageName = "";
        let data = req.body;
        let files = req.files?.dp;
        if (files) {
            imageName = data.dp = "user_image" + files?.name
        }


        let userObj = {
            name: data.username,
            email: data.email,
            phone: data.phone,
            lastLoggin: "",
            dp: imageName,
            role: data.role,
            location: data.location,
            password: data.password,
            block: "active"
        }
        commonHelper.addNewUser(userObj, files).then(function (userDetails) {
            console.log(userDetails)
            req.session.user = true;
            req.session.user_id = userDetails._id;
            req.session.user_data = userDetails;
            res.redirect("/")
        }).catch(function (err) {
            console.log(err)
            res.redirect("/sign-up?error=true")
        })

    },


    homePageController: async function (req, res) {
        let homePageData = {}


        let currentUrl;
        if (req.query.currentUrl) {
            currentUrl = req.query.currentUrl;
        }

        let getLimitedProduct = await commonHelper.getLimitedProduct(req, 8, true);
        homePageData.product = getLimitedProduct
        console.log(homePageData);

        res.render("users/index", { homePageData, currentUrl })

    },


    signInGet: function (req, res) {
        if (isLogged(req)) {
            res.redirect("/")
        } else {
            let data = {};
            if (req.query.error) {
                data.error = true
                data.msg = "Something Went Wrong"
            }
            res.render("users/sign-in", { data })
        }
    },

    signUpGet: function (req, res) {

        if (isLogged(req)) {
            res.redirect("/")
        }
        else {
            let data = {};
            if (req.query.error) {
                data.error = true
                data.msg = "Something Went Wrong"
            }
            res.render("users/sign-up", { data })
        }
    },

    accountPage: async function (req, res) {
        if (isLogged(req)) {
            let accountData = {};
            let status = req.query.status;

            if (status == "success") {
                accountData.message = "Account Updated Successfully";
                accountData.color = "success";
            } else if (status == "danger") {
                accountData.message = "Account Updated Failed";
                accountData.color = "danger";
            }

            let userData = await commonHelper.getSingleUser(req.session.user_id)
            accountData.user = userData
            console.log(accountData);

            res.render("users/account", { accountData })
        } else {
            res.redirect("/")
        }

    },

    userSignInPost: async function (req, res) {
        let loginValidation = await userHelper.userLogin(req.body);
        if (loginValidation) {
            console.log(loginValidation)
            req.session.user = true;
            req.session.user_id = loginValidation._id;
            req.session.user_data = loginValidation;
            res.redirect("/")
        } else {
            res.redirect("/sign-in?error=true")
        }
    },


    updateUserProfile: async function (req, res) {

        let data = req.body;

        let userObj = {
            name: data.username,
            email: data.email,
            phone: data.phone,
            role: data.role,
            location: data.location,
            password: data.password,
        }

        let files = req.files?.dp;
        if (files) {
            userObj.dp = files;
            userObj.dp.name = "user_image" + files?.name
        }

        let userUpdateData = await userHelper.updateUser(req.session.user_id, userObj)

        if (userUpdateData) {
            req.session.user_data.name = data.username
            res.redirect("/account?status=success")
        } else {
            res.redirect("/account?status=danger")
        }
    },


    productsPage: async function (req, res) {

        let searchQuery = req.query.searchProduct;
        let search = {
            $match: {
                status: 'UNBLOCK'
            }
        }

        if (searchQuery) {
            search.$match.product_name = { $regex: '.*' + searchQuery + '.*' }
        }


        let sort = req.query.productType;
        let sortType = { _id: 1 };

        if (sort) {
            if (sort == "low") {
                sortType = { price: 1 };
            } else if (sort == "high") {
                sortType = { price: -1 };
            }
        }

        console.log(search)

        let productFilter = await productModel.aggregate(
            [
                search,
                {
                    $sort: sortType
                },

            ]
        )


        let currentUrl;
        if (req.query.searchProduct) {
            currentUrl = req.query.searchProduct
        }

        let productLength = productFilter.length;
        console.log(productFilter);
        res.render("users/product_filtter", { product: productFilter, productLength: productLength, currentUrl });
    },




    addToCart: function (req, res) {
        //  res.json("Hello World")
        let productID = req.body.productId;
        let userID = req.session.user_id;

        if (req.session.user) {
            cartModel.find({ "user_id": userID }).then(function (data) {
                if (data.length != 0) {
                    let pushNewData = {
                        product_id: productID,
                        quantity: 1
                    }

                    cartModel.updateOne(
                        {
                            user_id: userID,
                        },
                        {
                            $push: {
                                products: pushNewData
                            }
                        }
                    ).then(function (data) {
                        res.json({ "status": true, "updated": true, "_id": data._id })
                    }).catch(() => {
                        res.json({ "status": false, "updated": false, error: "While Updating" })
                    })
                } else {
                    let createCart = {
                        user_id: new mongoose.Types.ObjectId(userID),
                        products: [
                            {
                                product_id:  new mongoose.Types.ObjectId(productID),
                                quantity: '1'
                            }
                        ]
                    }

                    new cartModel(createCart).save().then((data) => {
                        res.json({ "status": true, "updated": false, "_id": data._id })
                    }).catch(() => {
                        res.json({ "status": false, "updated": false, error: "While Inserting" })
                    })
                }

            })
        } else {
            res.json({ "status": false, "updated": false, error: "Login" })
        }
    },

    logout: function (req, res) {
        req.session.destroy();
        res.redirect("/")
    }


}


module.exports = userController;