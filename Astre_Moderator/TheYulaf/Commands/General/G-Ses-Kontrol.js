const { Message } = require("discord.js");
const Config = require("../../Configuration/Config.json");
module.exports.execute = async (client, message, args) => {
    let victim = message.mentions.members.first() || (args[0] ? await message.guild.getMember(args[0]) : undefined);
    if (!victim) return message.reply(`${Settings.emojiler.iptal} Geçerli bir \`@Yulaf/ID\` belirtmelisin`);
    message.reply(`Bu Kullanıcı (${victim.voice.channelID ?"" + victim.voice.channel.name + "**Adlı Kanalda Seste Sohbet Ediyor." : "Sunucuda her hangi bir ses kanalında bulunmuyor"}`);
}

module.exports.settings = {
    Commands: ["seskontrol", "sesk", "kses", "sk"],
    Usage: "seskontrol <member|id>",
    Description: "Etiketlediğin ya da ID'sini belirttiğin kişinin bir kanalda olup olmadığını, eğer kanaldaysa o kanalın ismini öğrenirsin.",
    Category: "General",
    cooldown: 2500,
    Activity: true
}