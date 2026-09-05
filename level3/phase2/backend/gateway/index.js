import express from "express";
// import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
// import User from "./model/user.model.js";
// import Redis from "ioredis";
// import sendEmail from "./lib/sendEmail.js";
// import { emailQueue } from "./worker.js";
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// export const redis = new Redis(process.env.REDIS_URL);


app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({ message: `Hello from ${process.env.SERVER_NAME}` })
})

app.use("/auth", proxy("http://auth-service:8001"))
app.use("/order", proxy("http://order-service:8002"))
app.use("/product", proxy("http://product-service:8003"))



app.listen(port, () => {
    console.log(`Server started ${port}`);
    // connectDB();
})

// without redis => 83ms

