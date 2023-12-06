"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
// const requestRoutes = require("./routes/requests");
// const offerRoutes = require("./routes/offers");
const businessRoutes = require("./routes/businesses");

const morgan = require("morgan");

const app = express();

app.use(cors({
  origin: 'https://peel-app-frontend-2fc4b8c41c2f.herokuapp.com'
  })
);

app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

//routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
// app.use("/requests", requestRoutes);
// app.use("/offers", offerRoutes);
app.use("/businesses", businessRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
