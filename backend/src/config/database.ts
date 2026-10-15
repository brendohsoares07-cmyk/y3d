import mysql from "mysql2/promise";
import { env } from "./env";

export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  charset: "utf8mb4",
  decimalNumbers: true,
  waitForConnections: true,
  connectionLimit: 10,
});
