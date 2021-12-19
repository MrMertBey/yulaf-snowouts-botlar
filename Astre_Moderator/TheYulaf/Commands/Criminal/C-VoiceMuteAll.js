const Discord = require("discord.js"),
client = new Discord.Client();
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");

module.exports.run = async (client, message, args) => {
    let yavuzembed = new Discord.MessageEmbed().setColor(0x7997ff)
    .setFooter(Config.Footer).setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))

if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(yavuzembed
    .setDescription(`${Settings.emojiler.iptal} Bunu kullanmaya yetkin yetmiyor!`)).then(m => m.delete({timeout: 10000}));
let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
if (!channel) message.channel.send(yavuzembed
    .setDescription(`${Settings.emojiler.iptal} Bir Kanal ID'si Belirtin yada bir kanala katılman gerek!`)).then(m => m.delete({timeout: 10000}));
channel.members.filter((s) => !s.hasPermission("ADMINISTRATOR"))
.forEach((s, index) => {
  s.voice.setMute(true);
});
message.channel.send(yavuzembed.setDescription(`${Settings.emojiler.tik} \`${channel.name}\` Kanalındaki Herkes Başarılı Bir Şekilde Susturuldu`))
};

module.exports.settings = {
    Commands: ["voicemuteall", "herkesisustur","vmuteall"],
    Usage: "voicemute <@user|id> [reason]",
    Description: "Bahsettiğin kanalda herkesi susturursun.",
    Category: "Criminal",
    Activity: true
}