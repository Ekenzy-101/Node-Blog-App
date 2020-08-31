const createError = require("http-errors");
const express = require("express");
const path = require("path");
const passport = require("passport");
const exphbs = require("express-handlebars");
const session = require("express-session");
const flash = require("express-flash");
const dotenv = require("dotenv");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

dotenv.config({ path: "./config/.env" });

const connectDB = require("./config/db");
connectDB(process.env.MONGO_URI);
const app = express();

// Passport Config
require("./config/passport")(passport);

// view engine setup
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sessions
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({
    //   mongooseConnection: mongoose.connection,
    // }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// // Global Vars
// app.use((req, res, next) => {
//   res.locals.successMsg = req.flash("successMsg");
//   res.locals.errorMsg = req.flash("errorMsg");
//   res.locals.error = req.flash("error");
//   next();
// });

// Logging
app.use(logger("dev"));
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    debug: true,
    outputStyle: "compressed",
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
