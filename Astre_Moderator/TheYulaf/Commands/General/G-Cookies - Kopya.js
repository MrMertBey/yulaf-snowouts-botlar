
const { Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");

module.exports.execute = async (client, message, args) => {

    if(!message.member.roles.cache.get(Settings.Perm.Commander) && !message.member.hasPermission('ADMINISTRATOR'))

var uye = message.member;

var isim = args.splice(0).join(" ");
if(!isim) return message.channel.send("Geçerli bir isim belirtmelisin!").then(x => x.delete({timeout: 5000}));

if(isim.length >= "26") return message.channel.send(`Max 25 karakter kullana bilirsin.`)


if(Config.TagVarYok) {

if(!message.member.roles.cache.has(Settings.Tag.Role)) {

uye.setNickname(`✧ ${isim}`).catch(e => { });
message.channel.send(`${message.member} Yeni adın : ✧ ${isim}`);    

} else {
uye.setNickname(`✦ ${isim}`).catch(e => { });
message.channel.send(`${message.member} Yeni adın ✦ ${isim}`);
}
} else {

uye.setNickname(`✦ ${isim}`).catch(e => { });
message.channel.send(`${message.member} Yeni adın ✦ ${isim}`);
}

};
module.exports.settings = {
    Commands: ["zengin","b"],
    Usage: "booster",
    Description: "Bahsettiğin kişiyi sunucudan atarsın.",
    Category: "Penal",
    Activity: true
}