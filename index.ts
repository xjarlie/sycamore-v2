import express from "express";
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors);
app.use(express.json());

