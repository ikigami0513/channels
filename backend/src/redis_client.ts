import * as redis from "redis";

export const client: redis.RedisClientType = redis.createClient();

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Failed to connect to Redis', err);
});