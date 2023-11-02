"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(`
        SELECT username,
               password
        FROM users
        WHERE username = $1`, [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username,
      password,
      firstName,
      lastName,
      companyName,
      email,
      isGrower,
      profilePic,
      isAdmin
    }) {
    const duplicateCheck = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`, [username],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
                INSERT INTO users
                (username,
                 password,
                 first_name,
                 last_name,
                 company_name,
                 email,
                 is_grower,
                 profile_pic,
                 is_admin)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING
                    username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    company_name AS "companyName",
                    email,
                    is_grower AS "isGrower",
                    profile_pic AS "profilePic",
                    is_admin AS "isAdmin"`, [
      username,
      hashedPassword,
      firstName,
      lastName,
      companyName,
      email,
      isGrower,
      profilePic,
      isAdmin,
    ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               company_name AS "companyName",
               email,
               is_grower AS "isGrower",
               profile_pic AS "profilePic",
               is_admin   AS "isAdmin"
        FROM users
        ORDER BY username`,
    );

    return result.rows;
  }

  /** Find all Buyers.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findBuyers() {
    const result = await db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               company_name AS "companyName",
               email,
               is_grower AS "isGrower",
               profile_pic AS "profilePic",
               is_admin   AS "isAdmin"
        FROM users
        WHERE is_grower = false
        ORDER BY username`,
    );

    return result.rows;
  }

  /** Find all Growers.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findGrowers() {
    const result = await db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               company_name AS "companyName",
               email,
               is_grower AS "isGrower",
               profile_pic AS "profilePic",
               is_admin   AS "isAdmin"
        FROM users
        WHERE is_grower = true
        ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, company_name, email,
   *          is_grower, profile_pic, is_admin, offers/requests}
   *   where offers/requests is
   *        { offer/request_id, produce_id, username, quantity_lbs, price, date }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               company_name AS "companyName",
               email,
               is_grower AS "isGrower",
               profile_pic AS "profilePic",
               is_admin   AS "isAdmin"
        FROM users
        WHERE username = $1`, [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    if (user.isGrower) {
      const userOffers = await db.query(`
          SELECT o.offer_id
          FROM offers AS o
          WHERE o.username = $1`, [username]);

      user.offers = userOffers.rows.map(o => o.offer_id);
    }
    else if(!user.isGrower){
      const userRequests = await db.query(`
          SELECT r.request_id
          FROM requests AS r
          WHERE r.username = $1`, [username]);

      user.requests = userRequests.rows.map(r => r.request_id);
    }
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name",
        companyName: "company_name",
        isGrower: "is_grower",
        profilePic: "profile_pic",
        isAdmin: "is_admin",
      });

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE users
        SET ${setCols}
        WHERE username = ${usernameVarIdx}
        RETURNING username,
            first_name AS "firstName",
            last_name AS "lastName",
            company_name AS "companyName",
            email,
            is_grower AS "isGrower",
            profile_pic AS "profilePic",
            is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(`
        DELETE
        FROM users
        WHERE username = $1
        RETURNING username`, [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** Make a request for produce **/

  static async requestProduce(
    { username,
      produceId,
      quantityLbs,
      pricePerLb,
      sellByDate }) {
    const preCheck = await db.query(`
        SELECT produce_id
        FROM produce
        WHERE produce_id = $1`, [produceId]);
    const produce = preCheck.rows[0];

    if (!produce) throw new NotFoundError(`No produce: ${produceId}`);

    const preCheck2 = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`, [username]);
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const request = await db.query(`
        INSERT INTO requests(
          produce_id,
          username,
          quantity_lbs,
          price,
          sell_by_date)
        VALUES ($1, $2, $3, $4, $5),
        RETURNING
          produce_id AS "produceId",
          quantity_lbs AS "quantityLbs",
          price as "pricePerLb",
          sell_by_date AS "sellByDate"`, [
      produceId,
      username,
      quantityLbs,
      pricePerLb,
      sellByDate
    ],
    );
    return request;
  }

  /** offer a type of produce **/

  static async offerProduce(
    { username,
      produceId,
      quantityLbs,
      pricePerLb,
      sellByDate }) {
    const preCheck = await db.query(`
        SELECT produce_id
        FROM produce
        WHERE produce_id = $1`, [produceId]);
    const produce = preCheck.rows[0];

    if (!produce) throw new NotFoundError(`No produce: ${produceId}`);

    const preCheck2 = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`, [username]);
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const offer = await db.query(`
        INSERT INTO offers(
          produce_id,
          username,
          quantity_lbs,
          price,
          sell_by_date)
        VALUES ($1, $2, $3, $4, $5),
        RETURNING
          produce_id AS "produceId",
          quantity_lbs AS "quantityLbs",
          price as "pricePerLb",
          sell_by_date AS "sellByDate"`, [
      produceId,
      username,
      quantityLbs,
      pricePerLb,
      sellByDate
    ],
    );
    return offer;
  }

}

module.exports = User;
