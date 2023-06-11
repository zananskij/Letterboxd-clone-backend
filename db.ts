import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const isProduction = process.env.NODE_ENV === "production"
const connectionString = isProduction
  ? process.env.DATABASE_URL
  : `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

export default pool
