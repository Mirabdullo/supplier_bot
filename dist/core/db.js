"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const sequelize_1 = require("sequelize");
const file = path_1.default.join(__dirname, "../../", "ca-certificate.crt");
const serverCa = [fs.readFileSync(file, "utf8")];
exports.sequelize = new sequelize_1.Sequelize("woodlinecrm", "doadmin", "AVNS_Hq7s9CF7p0HNn1ikIoZ", {
    host: "db-postgresql-fra1-95213-do-user-12466147-0.b.db.ondigitalocean.com",
    port: 25060,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: serverCa,
        },
    },
});
//# sourceMappingURL=db.js.map