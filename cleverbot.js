const cleverbot = require("cleverbot-free");
const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);

mongoose.connection.once("open", (_) => {
  console.log("Database connected!");
});

const IgUser = mongoose.model(
  "InstagramMessages",
  new mongoose.Schema({
    ChatID: String,
    Messages: [String],
  })
);

async function AddMessageToDB(chatId, messageSent) {
  if (await IgUser.exists({ ChatID: chatId }) == null) {
    let userDB = new IgUser({ ChatID: chatId, Messages: [messageSent] });
    await userDB.save();
  } else {
    let existDB = IgUser.findOne({ ChatID: chatId });
    await existDB.updateOne({ChatID: chatId}, {$push: {Messages: messageSent}}, {upsert: true})
  }
}

async function GetContext(chatId) {
  let getUser = IgUser.findOne({ ChatID: chatId });
  return getUser.Messages;
}

async function Chat(chatId, messageSent) {
  await AddMessageToDB(chatId, messageSent);

  let context = await GetContext(chatId);

  let res = await cleverbot(messageSent, context);
  await AddMessageToDB(chatId, res);
  return res;
}

module.exports = Chat;
