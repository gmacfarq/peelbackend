"use strict";

/** Routes for businesses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError, NotFoundError } = require("../expressError");
const Business = require("../models/business");
const businessNewSchema = require("../schemas/businessNew.json");
// const businessUpdateSchema = require("../schemas/businessUpdate.json");

const router = express.Router();

/** POST / { business }  => { business }
 *
 * Adds a new business to the marketplace.
 * Returns { id, name, description, website, image }
 *
 * authorization required: admin
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  console.log(req.body);
  const validator = jsonschema.validate(req.body, businessNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const business = await Business.createBusiness(req.body);
  return res.status(201).json({ business });
});

module.exports = router;