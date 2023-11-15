"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

/** Related functions for businesses. */

class Business{

  /**Create a business record.
   *
   * Returns { id, name, description, website }
   *
   * Throws BadRequestError if the business name exists.
   **/
  static async createBusiness({ name, description, website }) {

    const duplicateCheck = await db.query(`
        SELECT name
        FROM businesses
        WHERE name = $1`, [name],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate business: ${name}`);
    }

    const result = await db.query(
      `INSERT INTO businesses
           (name, description, website)
           VALUES ($1, $2, $3)
           RETURNING id, name, description, website`,
      [
        name,
        description,
        website,
      ],
    );
    let business = result.rows[0];

    return business;
  }

  /** Find all businesses.
   *
   * Returns [{ id, name, description, website }, ...]
   *
   **/

  static async findAll() {
    const businessesRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  website
           FROM businesses
           ORDER BY name`,
    );
    return businessesRes.rows;
  }

  /** Given a business id, return data about business.
   *
   * Returns { id, name, description, website }
   *
   * Throws NotFoundError if not found.
   **/

  static async getBusiness(id) {
    const businessRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  website
           FROM businesses
           WHERE id = $1`,
      [id],
    );

    const business = businessRes.rows[0];

    if (!business) throw new NotFoundError(`No business: ${id}`);

    return business;
  }

  /** Given a business id return a list of users asociated with that business
   *
   * Returns [{ username, firstName, lastName, email, isGrower }, ...]
   *
   * Throws NotFoundError if not found.
  */

  static async getUsers(id) {
    const usersRes = await db.query(
      `SELECT u.username,
              u.firstName,
              u.lastName,
              u.email
        FROM users AS u
        JOIN businesses AS b ON u.business_id = b.id
        WHERE b.id = $1`,
      [id],
    );

    const users = usersRes.rows;

    if (!users) throw new NotFoundError(`No users for business: ${id}`);

    return users;
  }

  /** Update business data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { name, description, website }
   *
   * Returns { id, name, description, website }
   *
   * Throws NotFoundError if not found.
   */

  static async updateBusiness(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        name: "name",
        description: "description",
        website: "website",
      });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE businesses
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id,
                                name,
                                description,
                                website`;
    const result = await db.query(querySql, [...values, id]);
    const business = result.rows[0];

    if (!business) throw new NotFoundError(`No business: ${id}`);

    return business;
  }

  /** Delete given business from database
   *
   *  returns {deleted: id}
   */
  static async delete(id){
    let result = await db.query(
      `DELETE
      FROM businesses
      WHERE id = $1
      RETURNING id`,
      [id]
    );
    const business = result.rows[0];

    if (!business) throw new NotFoundError(`No business: ${id}`);

    return {deleted: id};
  }
}

module.exports = Business;