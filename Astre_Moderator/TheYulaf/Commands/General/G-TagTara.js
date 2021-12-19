const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

 module.exports.execute = async (client, message, args) => {
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply('Bunu Kullanmaya Yetkin YOK!')
      let embed = new MessageEmbed().setColor('RANDOM')
      let tag = Settings.Tag.Tag
      let tagrol = Settings.Tag.Role
  
      let taglılar = message.guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(tagrol))
      let tagsızlar = message.guild.members.cache.filter(s => !s.user.username.includes(tag) && s.roles.cache.has(tagrol))
  
      taglılar.array().forEach((yulaf, index) => {
          setTimeout(async() => {
            yulaf.roles.add(tagrol)
          }, index * 1000)
  
      })
      tagsızlar.array().forEach((yulaf, index) => {
          setTimeout(async() => {
            yulaf.roles.remove(tagrol)
          }, index * 1000)
      })
      message.channel.send(embed.setDescription(`${Settings.emojiler.yıldız} **${taglılar.size}** Kullanıcıya taglı rolü verilecek.\n ${Settings.emojiler.yıldız} **${tagsızlar.size}** Kullanıcıdan taglı rolü alınacak.`))
  
  }
module.exports.settings = {
    Commands: ["tag-tara", "tagt"],
    Usage: "tag-tara",
    Description: "Tüm Herkesi Belirlediğin ID Kanalına çeker.",
    Category: "General",
    Activity: true
}