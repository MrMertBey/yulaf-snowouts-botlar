const { MessageEmbed } = require("discord.js");
const axios = require('axios');
const Config = require("../../Configuration/Config.json");

module.exports.execute = async (client, message, args) => {

    var user = message.mentions.members.first() || client.users.cache.get(args[0]) || message.member;

    axios({
        method: 'GET',
        url: `https://discord.com/api/v8/users/${user.id}`,
        headers: {
            Authorization: `Bot ${Config.Token}`
        }
    })
        .then(function (response) {
            try {
                if (response.data.banner.includes(".null")) return message.channel.send(`Kullanıcının banneri yok!.`)
                
                message.channel.send(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}?size=512&gif`)
            } catch (err) {
                message.channel.send(`Kullanıcının banneri yok!.`)
            }
        })
}
module.exports.settings = {
    Commands: ["banner"],
    Usage: "banner",
    Description: "Bahsettiğin kişiyi sunucudan atarsın.",
    Category: "banner",
    Activity: true
}