import twilio from 'twilio';
const logger = require("pino")();

import config from "../../src/config";

class Twilio {
  constructor() {
    this.client = new twilio(config.twilioId, config.twilioAuthToken);
  }

  sendNotifications({ body, to }) {
    return this.client.messages.create({
      body: body,
      to: to,
      from: config.twilioNumber
    });
  }
}

// create a SINGLETON so we only have one instance of twilio middleware
export let twilioClient = new Twilio();
