"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Order {

  /** Find all orders with associated request.
     *
     * Returns [{ id, name, description, website, image }, ...]
     *
     **/

  static async findAll(requestId) {
    const orderRes = await db.query(`
      SELECT id,
                username,
                request_id,
                quantity,
                status
      FROM orders
      WHERE request_id = $1
      ORDER BY quantity`, [requestId]
    );
    return orderRes.rows;
  }

}

module.exports = Order;