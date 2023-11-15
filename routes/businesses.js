"use strict";

/** Routes for businesses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
const { BadRequestError, NotFoundError } = require("../expressError");
const Business = require("../models/business");
const businessNewSchema = require("../schemas/businessNew.json");
const businessUpdateSchema = require("../schemas/businessUpdate.json");

const router = express.Router();

