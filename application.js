const express = require("express");
const app = express();
const errMiddleware = require("./middleware/errorMiddleware");
const userRouter = require("./router/userRouter");
const predictionRouter = require("./router/predictionRouter");
const adminRouter = require("./router/adminRouter");
const path = require("path");
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//router

//   app.options('', (req, res) => {
//     res.header('Access-Control-Allow-Origin', '');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token');
//     res.sendStatus(200);
//   });
// app.use(cors({
//     origin: '*', // Atau spesifik URL seperti 'https://example.com/'
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type,x-access-token'
// }));

app.get("/", (req, res) => {
  res.send({
    status: "success",
    message: "API for Dental Education",
  });
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/predictions", predictionRouter);
app.use("/api/v1/admins/", adminRouter);
app.all("*", (req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server`);
  err.status = "failed";
  err.statusCode = 404;

  next(err);
});

app.use(errMiddleware);

module.exports = app;
