import config from './config/app.config.js';
import {server} from './bootstrap/server.js';
import { connectToDatabase } from './config/db.config.js';
import { connectToRedis, redisClient } from "./config/redis.config.js";

(() =>
{
    try {
        connectToDatabase();
        connectToRedis();
        server.listen(config.port, () => 
        {
            console.info(`server is running on port :${config.port}`);
        })

    } catch (error) {
        console.error.bind(console, 'the server could not be started');
    }
})();


