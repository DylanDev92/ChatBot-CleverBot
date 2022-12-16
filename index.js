/* const cleverbot = require("cleverbot-free");

cleverbot("Hello.").then(response => console.log(response)); */

require('dotenv').config();

const Insta = require('@arashgh/insta-js');

const client = new Insta.Client();

client.on('connected', () => {
    console.log(`Logged in as ${client.user.username}`);
});

client.on('messageCreate', (message) => {
    if (message.author.id === client.user.id) return

    message.markSeen();

    if (message.content === '!ping') {
        message.reply('!pong');
    }
});

client.on('newFollower', (user) => {
    user.send("Hello " + user.fullName + " I hope we can be good friends! 😀 \n")
    user.follow();
})

client.on('pendingRequest', (chat) => {
    console.log("Acepted chat request from: " + chat.name)
    chat.aprove();
})

client.login(process.env.USER, process.env.PASSWORD);