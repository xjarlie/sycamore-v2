import path from "path";
import Database from "./Database";

const db = new Database(path.join(__dirname, '../db/dev.json'));

export default db;