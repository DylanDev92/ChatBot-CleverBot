require('dotenv').config();
const Chat = require('./cleverbot')

const Insta = require('@arashgh/insta-js');

const client = new Insta.Client();

client.on('connected', () => {
    console.log(`Logged in as ${client.user.username}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return

    message.markSeen();

    message.chat.startTyping();
    
    let getMessage = await Chat(message.chat.id, message.content);

    message.chat.stopTyping();
    message.chat.sendMessage(getMessage);
});

client.on('newFollower', (user) => {
    user.send("Hello " + user.fullName + " I hope we can be good friends! 😀 \n")
    user.follow();
})

client.on('pendingRequest', (chat) => {
    console.log("Acepted chat request from: " + chat.name)
    chat.approve();
})

client.login(process.env.USER, process.env.PASSWORD);