"use strict";

/** Database setup for peel. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

const db = new Client({
  connectionString: getDatabaseUri(),
  ssl: {
    rejectUnauthorized: false, // for self-signed certificates
  },
});

db.connect();

module.exports = db;
