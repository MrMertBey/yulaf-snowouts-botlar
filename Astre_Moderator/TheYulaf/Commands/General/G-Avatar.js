const { Message, Client, MessageEmbed } = require("discord.js");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    let yulaf = message.mentions.users.first() || (args[0] ? await client.users.getUser(args[0]) : undefined) || message.author;

    message.channel.send(new MessageEmbed()
        .setImage(yulaf.avatarURL({ dynamic: true }))
        .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        .setColor("#2F3136"))
}
module.exports.settings = {
    Commands: ["avatar", "pp","av"],
    Usage: "avatar <member/id>",
    Description: "Etiketlediğin kişinin Discord'daki profil fotoğrafını birçok formatta alırsın ve indirebilir duruma getirirsin.",
    Category: "Penal",
    cooldown: 10000,
    Activity: true
}