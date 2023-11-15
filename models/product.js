"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Product {
  /** Create a product record.
   *
   * returns { id, name, description, website, image }
   *
   * Throws BadRequestError if the product name exists.
   */

  static async createProduct({ name, description, website, image }) {
    const duplicateCheck = await db.query(
      `SELECT name
        FROM products
        WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate product: ${name}`);
    }

    const result = await db.query(
      `INSERT INTO products
            (name, description, website, image)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, description, website, image`,
      [name, description, website, image]
    );
    let product = result.rows[0];

    return product;
  }



  static _filterWhereBuilder({ nameLike }) {
    let whereParts = [];
    let vals = [];

    if (nameLike) {
      vals.push(`%${nameLike}%`);
      whereParts.push(`name ILIKE $${vals.length}`);
    }

    const where = (whereParts.length > 0) ?
        "WHERE " + whereParts.join(" AND ")
        : "";

    return { where, vals };
  }

  /** Find all products.
   *
   * Returns [{ id, name, description, website, image }, ...]
   *
   **/

  static async findAll(searchFilters = {}) {
    const { nameLike } = searchFilters;

    const { where, vals } = this._filterWhereBuilder({
      nameLike,
    });

    const productRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  website,
                  image
           FROM products ${where}
           ORDER BY name`, vals
    );
    return productRes.rows;
  }

  /** Given a product id, return data about product.
   *
   * Returns { id, name, description, website, image }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const productRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  website,
                  image
           FROM products
           WHERE id = $1`,
      [id]
    );

    const product = productRes.rows[0];

    if (!product) throw new NotFoundError(`No product: ${id}`);

    return product;
  }

  /** Update product data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name, description, website, image }
   *
   * Returns { id, name, description, website, image }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      name: "name",
      description: "description",
      website: "website",
      image: "image",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE products
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id,
                                name,
                                description,
                                website,
                                image`;
    const result = await db.query(querySql, [...values, id]);
    const product = result.rows[0];

    if (!product) throw new NotFoundError(`No product: ${id}`);

    return product;
  }

  /** Delete given product from database
   *
   *  returns {deleted: id}
   */

  static async delete(id) {
    const result = await db.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    const product = result.rows[0];

    if (!product) throw new NotFoundError(`No product: ${id}`);

    return { deleted: id };
  }

}

module.exports = Product;