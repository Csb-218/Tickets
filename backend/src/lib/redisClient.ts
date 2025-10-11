import Redis  from "ioredis";
import type { RedisOptions } from "ioredis";

const options:RedisOptions = {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT)!,
}

const redis = new Redis(options);

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err:Error) => console.error("❌ Redis error:", err));

export default redis;
