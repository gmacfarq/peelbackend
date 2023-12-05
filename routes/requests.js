"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Request {
  /** Create a produce request */

  /** Get all requests for a given user */
  static async findAll(username) {
    const result = await db.query(`
      SELECT id,
             produce_id,
             username,
             produce_name,
             quantity,
             price,
             recieve_by
      FROM requests
      WHERE username = $1`, [username],
    );

  }

}