/** Routes for products */

const jsonschema = require("jsonschema");


const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Product = require("../models/product");
const productNewSchema = require("../schemas/productNew.json");
const productUpdateSchema = require("../schemas/productUpdate.json");
const productSearchSchema = require("../schemas/productSearch.json");


const router = express.Router();

/** POST / { product }  => { product }
 *
 * Adds a new product to the marketplace.
 * Returns { id, name, description, website, image }
 *
 * authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, productNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const product = await Product.createProduct(req.body);
  return res.status(201).json({ product });
});

/** GET / => { products: [ { id, name, description, website, image }, ... ] }
 *
 * Returns list of all products.
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  //const nameLike = q.nameLike;
  const validator = jsonschema.validate(
    q,
    productSearchSchema,
    { required: true });

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const products = await Product.findAll(q);
  return res.json({ products });
});

/** GET /[id] => { product }
 *
 * Returns { id, name, description, website, image }
 *   where product is an object of a product.
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  const product = await Product.get(req.params.id);
  return res.json({ product });
});

/** PATCH /[id] { product } => { product }
 *
 * Data can include:
 *   { name, description, website, image }
 *
 * Returns { id, name, description, website, image }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, productUpdateSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const product = await Product.update(req.params.id, req.body);
  return res.json({ product });
});

/** DELETE /[id]  =>  { deleted: id }
 *

 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  await Product.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});

module.exports = router;
