import path from "path";
import * as fs from "fs"
import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()


const file = path.join(__dirname, "../../", "ca-certificate.crt");
const serverCa = [fs.readFileSync(file, "utf8")];

const db: string = process.env.DB || ""
const username: string = process.env.ADMIN || ""
const password: string = process.env.PASSWORD || ""
const host: string = process.env.HOST || ""
const port: number = parseInt(process.env.PORT || "")


export const sequelize = new Sequelize(db, username, password, {
    host: host,
    port: port,
    dialect: "postgres", // or 'mysql', 'sqlite', 'mssql', etc.
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: serverCa,
        },
    },
});