import { Client } from "whatsapp-web.js";
import chalk from "chalk";
import qrcode from "qrcode-terminal";
import fs from "fs";

const client = new Client();
const log = console.log;

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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
      const link = temp.link;
      const msg = message + "\n" + link;
      const contactList = temp.contactList;
      contactList.map((number, index) => {
        setTimeout(() => {
          try {
            const chatId = `91${parseInt(number)}@c.us`;
            client.sendMessage(chatId, msg);
            log("Message sent to " + chalk.green(number) + " successfully");
          } catch (error) {
            log("Error sending message to " + chalk.red(number));
            log(chalk.red(error?.message));
          }
        }, 3000);
      });
    }
  });
});

client.initialize();
