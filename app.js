// dotenv
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// custom modules
const cors = require("cors");

// refer to paths
const loginRouter = require("./routers/loginRouter");
const signupRouter = require("./routers/signupRouter");
const tokenRouter = require("./routers/tokenRouter");
const logoutRouter = require("./routers/logoutRouter");
const postRouter = require("./routers/postRouter");
const deleteRouter = require("./routers/deleteRouter");
const bookRouter = require("./routers/bookRouter");
const chronologyRouter = require("./routers/chronologyRouter");

const app = express();

// custom middleware
app.use(cors());

// basic template
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes setup
app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/request-access-token", tokenRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/post", postRouter);
app.use("/api/delete", deleteRouter);
app.use("/api/book", bookRouter);
app.use("/api/chronology", chronologyRouter);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (_, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(function(_, _, next) {
    next(createError(404));
});

app.use(function(err, req, res, _) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.send(`something went wrong... error: ${res.locals.message}`);
});

module.exports = app;
