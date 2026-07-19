import {config} from "dotenv"
import {createClient} from "redis";
config()

export const redisClient = createClient({
    url: process.env.REDIS_URL,
    RESP: 2,
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

export const connectToRedis = async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis Connected");
    } catch (error) {
        console.error(error);
    }
};