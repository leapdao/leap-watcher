import express from "express";
import bodyParser from "body-parser";
import Watcher from "./lib/watcher";
import cors from "cors";
import redis from "redis";
const logger = require("pino")();
const pino = require("express-pino-logger")();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pino);
app.use(cors());

// initialize Leap Watcher
let watcher = new Watcher();
watcher.init();

// initialize Redis
const redisClient = redis.createClient();

redisClient.on("error", err => {
  logger.info("error", err);
});

// API
app.post("/subscribe", (req, res) => {
  const { phoneNumber, address } = req.body;

  logger.info(`CREATED SUBSCRIPTION: ${address | phoneNumber}`);
  redisClient.hmset("subscriptions", address, phoneNumber);
  res.status(200).send("Successfully Subscribed.");
});

// App Listener
app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
