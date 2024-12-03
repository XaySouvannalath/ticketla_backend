const mysql = require("mysql");

const db = require("../services/dbrun");
const config = require("../config/db");
const chalk = require("chalk");


async function initialize() {
  console.log(chalk.yellow("starting mysql database..."));
  await mysql.createPool(config.smsPool);
  console.log(chalk.green("mysql database started."));
}

async function exec(statement, binds = []) {
  return new Promise(async (resolve, reject) => {
    try {
      db.query(statement, binds, (err, results) => {
        resolve(results);
      });
    } catch (err) {
      reject(err);
    } /* finally{
      db.end()
    } */
  });
}

module.exports.exec = exec;
module.exports.initialize = initialize;
