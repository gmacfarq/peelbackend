"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 * {user: { username, firstName, lastName, email, isGrower, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userNewSchema,
    { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const user = await User.register(req.body);
  const token = createToken(user);
  return res.status(201).json({ user, token });
});


/** GET / => { users: [ {username, firstName, lastName, email, ... }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  const users = await User.findAll();
  return res.json({ users });
});

/** GET / => { users: [ {username, firstName, lastName, email, ... }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/growers", ensureAdmin, async function (req, res, next) {
  const growers = await User.findGrowers();
  return res.json({ growers });
});

/** GET / => { users: [ {username, firstName, lastName, email, ... }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/buyers", ensureAdmin, async function (req, res, next) {
  const buyers = await User.findBuyers();
  return res.json({ buyers });
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, offers/requests }
 *   where offers/requests is [{ requestId, produceId, quantityInLbs, price, requqestDate}, ...]
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  const user = await User.get(req.params.username);
  return res.json({ user });
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isGrower, profilePic, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userUpdateSchema,
    { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const user = await User.update(req.params.username, req.body);
  return res.json({ user });
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  await User.remove(req.params.username);
  return res.json({ deleted: req.params.username });
});

/** POST /[username]/request  { state } => { application }
 *
 * Returns {"requested": requestId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/requests", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    requestSchema,
    { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const request = await User.requestProduce(req.body);
  return res.json({ requested: request });
});

/** POST /[username]/offer  { state } => { application }
 *
 * Returns {"offered": offerId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/offers", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    offerSchema,
    { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const offer = await User.offerProduce(req.body);
  return res.json({ offered: offer });
});

module.exports = router;

/** POST /[username]/orders  { state } => { application }
 *
 * Returns {"ordered": orderId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/orders", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    orderSchema,
    { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const orders = await User.orderProduce(req.body);
  return res.json({ ordered: orders });
});

module.exports = router;
