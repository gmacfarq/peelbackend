"use strict";

/** Routes for orders. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Order = require("../models/order");


const router = express.Router();


/** GET / => { orders: [ { id, name, description, website, image }, ... ] }
 *
 * Returns list of all orders.
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  console.log(q.requestId);
  // const validator = jsonschema.validate(
  //   q,
  //   { required: true });

  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }

  const orders = await Order.findAll(q.requestId);
  return res.json({ orders });
});

module.exports = router;
