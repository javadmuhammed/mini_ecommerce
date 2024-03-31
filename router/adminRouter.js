
let express = require("express")
let router = express.Router();
let adminController = require("../controller/adminController")



function isLogged(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("/admin")
    }
}



router.get("/", adminController.adminLoginPageGet)
router.post("/adminlogin", adminController.adminLoginPost)
router.get("/dashboard", isLogged, adminController.adminDashboard)
router.get("/addProduct", isLogged, adminController.addProductGet)
router.post("/addProduct", isLogged, adminController.addProductPost)
router.get("/manageProduct", isLogged, adminController.manageProduct)
router.post("/productManage", isLogged, adminController.productManage)
router.get("/editProduct", isLogged, adminController.editProduct)
router.post("/editProduct", isLogged, adminController.editProductPost)
router.get("/addNewUser", isLogged, adminController.addUserGet)
router.post("/addUser", isLogged, adminController.addUserPost)
router.get("/manageUsers", isLogged, adminController.manageUsers)
router.post("/userManage", isLogged, adminController.userManage)
router.get("/logout", isLogged, adminController.logout)

module.exports = router;

