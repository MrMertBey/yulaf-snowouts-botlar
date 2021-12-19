    
const {Client, MessageEmbed} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");

const Helper = require("../../Utils/Helper");
const PM = require("../../Managers/PenalManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {

if(!message.member.roles.cache.get(Settings.Perm.Commander) && !message.member.hasPermission('ADMINISTRATOR'))


return message.channel.send(new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL()({dynamic: true}))
.setDescription(`${Settings.emojiler.iptal} Bunu kullanmaya yetkin yetmiyor!`)
.setFooter(Config.Footer)
.setColor('2F3136'))

let yulaf = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!yulaf) return message.channel.send(new MessageEmbed()
.setDescription(`${Settings.emojiler.iptal} Geçerli bir \`@Yulaf/ID\` belirtmelisin`)
.setColor("#2F3136")).then(msg => msg.delete({timeout: 5000}))

const embed = new MessageEmbed()
.setColor('2F3136')
.setFooter(Config.Footer)
.setDescription(`${yulaf}, kullanıcısına <@&${Settings.Perm.Tasarımcı}> rolü verildi!`)
.setTimestamp()
message.channel.send(embed)

yulaf.roles.add(Settings.Perm.Tasarımcı)}

module.exports.settings = {
    Commands: ["tasarımcı","design","designer"],
    Usage: "tasarımcı",
    Description: "Bahsettiğin kişiyi sunucudan atarsın.",
    Category: "Penal",
    Activity: true
}