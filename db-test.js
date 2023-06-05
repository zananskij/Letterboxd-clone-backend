require("dotenv").config()
const { Pool } = require("pg")

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
})

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Error executing query", err.stack)
  } else {
    console.log("Response:", res.rows[0])
  }
  pool.end()
})
