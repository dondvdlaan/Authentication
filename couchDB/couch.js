"use strict"
const dbURL = `http://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:5984`
const db     = require("nano")(dbURL).db;

module.exports = db; 
