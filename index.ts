import express from 'express';
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";
import router from "./routes/router";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use('/', router);

app.get('/hello', (req, res) => {
    res.json({text: 'hello'});
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
