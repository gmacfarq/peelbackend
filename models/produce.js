"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Produce {
  /** Create a produce record.
   *
   * returns { id, name, description, image }
   *
   * Throws BadRequestError if the produce name exists.
   */

  static async createProduce({ name, description, image }) {
    const duplicateCheck = await db.query(
      `SELECT name
        FROM produce
        WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate produce: ${name}`);
    }

    const result = await db.query(
      `INSERT INTO produce
            (name, description, image)
            VALUES ($1, $2, $3)
            RETURNING id, name, description, image`,
      [name, description, image]
    );
    let produce = result.rows[0];

    return produce;
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

  /** Find all produce.
   *
   * Returns [{ id, name, description, image }, ...]
   *
   **/

  static async findAll(searchFilters = {}) {
    const { nameLike } = searchFilters;

    const { where, vals } = this._filterWhereBuilder({
      nameLike,
    });

    const produceRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  image
           FROM produce ${where}
           ORDER BY name`, vals
    );
    return produceRes.rows;
  }

  /** Given a produce id, return data about produce.
   *
   * Returns { id, name, description, image }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const produceRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  image
           FROM produce
           WHERE id = $1`,
      [id]
    );

    const produce = produceRes.rows[0];

    if (!produce) throw new NotFoundError(`No produce: ${id}`);

    return produce;
  }

  /** Update produce data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name, description, image }
   *
   * Returns { id, name, description, image }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      name: "name",
      description: "description",
      image: "image",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE produce
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id,
                                name,
                                description,
                                image`;
    const result = await db.query(querySql, [...values, id]);
    const produce = result.rows[0];

    if (!produce) throw new NotFoundError(`No produce: ${id}`);

    return produce;
  }

  /** Delete given produce from database
   *
   *  returns {deleted: id}
   */

  static async delete(id) {
    const result = await db.query(
      `DELETE FROM produce
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    const produce = result.rows[0];

    if (!produce) throw new NotFoundError(`No produce: ${id}`);

    return { deleted: id };
  }

}

module.exports = Produce;