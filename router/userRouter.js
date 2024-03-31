

let express = require("express");
let router = express.Router()
let userController = require("../controller/userController") 


 
router.get("/",userController.homePageController)
 

router.get("/sign-in", userController.signInGet)
router.get("/sign-up", userController.signUpGet)
router.get("/account", userController.accountPage)
router.get("/products", userController.productsPage)
router.get("/logout", userController.logout)

router.post("/add-cart", userController.addToCart)
router.post("/user-sign-up", userController.userSignUp)
router.post("/sign-in", userController.userSignInPost)
router.post("/updateUserProfile", userController.updateUserProfile) 


module.exports = router;