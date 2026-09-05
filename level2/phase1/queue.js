import { Queue } from "bullmq";
import { redis } from "./index.js";

const connection = new Redis("redis://localhost:6379", {
    maxRetriesPerRequest: null
});

const emailQueue = new Queue("email", { connection: connection });

export default emailQueue;