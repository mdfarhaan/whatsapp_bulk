import { Client } from "whatsapp-web.js";
import chalk from "chalk";
import qrcode from "qrcode-terminal";
import fs from "fs";

const client = new Client();
const log = console.log;

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  fs.readFile("resource.json", "utf8", (err, data) => {
    if (err) {
      log(chalk.red("Error reading file"));
      log(chalk.red(err.message));
    } else {
      let temp = JSON.parse(data);
      const message = temp.message;
      const contactList = temp.contactList;
      const sendMessage = contactList.map((number) => {
        try {
          const chatId = `91${number}@c.us`;
          client.sendMessage(chatId, message);
          log("Message sent to " + chalk.green(number) + " successfully");
        } catch (error) {
          log("Error sending message to " + chalk.red(number));
          log(chalk.red(error?.message));
        }
      });

      Promise.all(sendMessage).catch((error) => {
        console.log(error.message);
      });
    }
  });
});

client.initialize();
