
let express = require("express")
let app = express();
let hbs = require("hbs")

const { v4: uuidv4 } = require('uuid');
let session = require('express-session')
let nocache = require("nocache")

const fileUpload = require("express-fileupload");
let adminRouet = require("./router/adminRouter")
let userRouter = require("./router/userRouter")

app.use(session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}))

let connection = require("./config/connection");




app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(nocache())


hbs.registerPartials(__dirname + "/views/partials")
app.use(express.static("public"))
app.set('view engine', 'hbs');
app.set("views", __dirname + "/views")

app.use((req, res, next) => {

    let data = {}
    if (req.session.user) {
        data.username = req.session.user_data.name
    }

    res.locals.data = data;
    next();
});
app.use("/admin", adminRouet)
app.use("/", userRouter)




app.listen(7000, function () {
    console.log("Server started at https://localhost:7000");
})