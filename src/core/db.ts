import path from "path";
import * as fs from "fs"
import { Sequelize } from "sequelize";


const file = path.join(__dirname, "../../", "ca-certificate.crt");
const serverCa = [fs.readFileSync(file, "utf8")];

export const sequelize = new Sequelize("woodlinecrm", "doadmin", "AVNS_Hq7s9CF7p0HNn1ikIoZ", {
    host: "db-postgresql-fra1-95213-do-user-12466147-0.b.db.ondigitalocean.com",
    port: 25060,
    dialect: "postgres", // or 'mysql', 'sqlite', 'mssql', etc.
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: serverCa,
        },
    },
});