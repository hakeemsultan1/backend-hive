import express from "express";
import cors from "cors";
import 'dotenv/config';
import index from "./routes/index.js";
import connectDB from "./db/db.js";
import morgan from "morgan";
import path from "path";
import cron from "./cronjobs/cron.js";

const app = express();
const corsOptions = {
    origin: ['*'],
};

// app.use(cors(corsOptions));
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use(morgan("dev"));
app.use(express.json());

app.use("/", index);

app.listen(Number(process.env.PORT), () => {
    connectDB();
    console.log(`Server running on port ${process.env.PORT}`);
})
