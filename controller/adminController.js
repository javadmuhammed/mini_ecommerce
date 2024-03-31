

let adminHelper = require("../helper/adminHelper");
const commonHelper = require("../helper/commonHelper");
let otherHelper = require("../helper/commonHelper");
let queryString = require("querystring")



function isAdmin(req) {
    if (req.session.admin) {
        return true;
    }
    return false;
}



let adminController = {


    adminLoginPageGet: async function (req, res) {
        if (isAdmin(req)) {
            res.redirect("/admin/dashboard")
        } else {
            res.render("admin/index")
        }
    },

    adminLoginPost: async function (req, res) {
        let data = req.body;
        let adminValidation = await adminHelper.adminLoginValidation(data);
        if (!adminValidation) {
            res.render("admin/index", { error: true, msg: "Wrong credentials" })
        }
        else {
            console.log("Loggin Success");
            req.session.admin = true;
            res.redirect("/admin/dashboard")
        }
    },

    adminDashboard: async function (req, res) {
        let adminDetails = await adminHelper.getAdminData(); 
        res.render("admin/dashboard", { adminDetails })
    },

    addProductGet: function (req, res) {

        if (req.query.alert) {
            res.render("admin/addProduct", { status: req.query.status, msg: req.query.msg })
        } else {
            res.render("admin/addProduct")
        }

    },

    addProductPost: function (req, res) {
        let product_data = req.body;
        let files = req.files.product_image;
        files.name = "product_image_" + files.name
        product_data.files = files;

        let insertProduct = adminHelper.addProduct(product_data).then(function () {
            res.redirect("/admin/addProduct?alert=true&status=success&msg=Product inserted success")
        }).catch(function () {
            console.log(insertProduct);
            res.redirect("/admin/addProduct?alert=true&status=danger&msg=Product inserted failed")
        })

    },

    editProduct: async function (req, res) {

        let dataToSend = {};
        let status = req.query.status;
        if (status) {
            if (status == "success") dataToSend.color = status
            if (req.query.msg) dataToSend.msg = req.query.msg
        }

        let editId = req.query.edit_id;
        let editData = await adminHelper.getProductById(editId);
        dataToSend.productData=editData  
        res.render("admin/editProduct", { dataToSend })
    },

    editProductPost: async function (req, res) {

        let product_data = req.body;
        let files = req.files?.product_image;
        if (files) {
            files.name = "product_image_" + files?.name
            product_data.files = files;
        }
 
        let updateProduct = await adminHelper.editProduct(product_data.editid, product_data)
   
        if (updateProduct) {
            res.redirect(`/admin/editProduct?edit_id=${product_data.editid}&status=success&msg=Product Updated Success`)
        } else {
            res.redirect(`/admin/editProduct?edit_id=${product_data.editid}&status=danger&msg=Product Updated Failed`)
        }
    },



    manageProduct: async function (req, res) {

        let filtter = {};
        if (req.query.status) filtter["status"] = (req.query.status == "active") ? "UNBLOCK" : "BLOCK";

        let sendData = {}
        let products = await otherHelper.getAllProduct(filtter);
        sendData.products = products;
        if (req.query.result) {
            sendData.result = req.query.result;
            sendData.msg = req.query.msg;
        } 
        res.render("admin/manageProduct", { sendData })
    },

    productManage: async function (req, res) {
        let data = req.body;
        let status = {
            result: "danger",
            msg: "Something Error"
        }

        if (data.action_product_type == "DELETE") {
            await adminHelper.deleteProducts(data.product_id)
            status.result = "success"
            status.msg = "product delete success"
        } else {
            await adminHelper.updateProductStatus(data.product_id, data.action_product_type)
            status.result = "success"
            status.msg = "product update success"
        }


        let queryStatus = queryString.stringify(status)
        console.log(queryStatus);

        res.redirect(`/admin/manageProduct?${queryStatus}`)
    },


    addUserGet: function (req, res) {

        if (req.query.alert) {
            res.render("admin/addNewUser", { status: req.query.status, msg: req.query.msg })
        } else {
            res.render("admin/addNewUser")
        }
    },

    addUserPost: async function (req, res) {

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
            block: data.block
        }



        commonHelper.addNewUser(userObj, files).then(function () {
            res.redirect("/admin/addNewUser?alert=true&status=success&msg=User inserted success")
        }).catch(function () {
            res.redirect("/admin/addNewUser?alert=true&status=danger&msg=User inserted failed")
        })
    },


    manageUsers: async function (req, res) {
 
        let filtter = {};
        if (req.query.filtter) {
            filtter.block = req.query.type
        }
        let usersData = await adminHelper.getAllUsers(filtter);

        let passQuery = { product: usersData };

        if (req.query.result) {
            passQuery.result = (req.query.result == 'true') ? 'success' : "danger";
        }
        if (req.query.type) {
            passQuery.type = (req.query.type == 'DELETE') ? 'delete' : "update";
        }   

        console.log(passQuery);

        res.render("admin/manageUsers", { passQuery })
    },


    userManage: async function (req, res) {
        let data = req.body;
        let result = null;
        let type = null;
        if (data.action_users == "DELETE") {
            result = await adminHelper.deleteUsers(data.user_id);
            if (result) {
                result = true
                type = "DELETE"
            }
        } else {
            result = await adminHelper.updateUserStatus(data.user_id, data.action_users);
            if (result) {
                result = true
                type = "UPDATE"
            }
        }

        if (result) {
            res.redirect(`/admin/manageUsers?result=${result}&type=${type}`)
        }
    },

    logout: function (req, res) {
        req.session.destroy(function (err) {
            if (!err) {
                res.redirect("/admin")
            }
        });
    }

}


module.exports = adminController;