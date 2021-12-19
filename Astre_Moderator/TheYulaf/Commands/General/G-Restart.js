const Discord = require('discord.js');


module.exports.execute = async (client, message, args) => {

    message.channel.send("Bot yeniden başlatılıyor").then(msg => {
        console.log("[BOT] Yeniden başlatılıyor ");
        process.exit(0);
    });

};
module.exports.settings = {
    Commands: ["reboot","restart"],
    Usage: "reboot",
    Activity: true,
    permLevel: 4,
    Category: "Penal",
    cooldown: 10000
}