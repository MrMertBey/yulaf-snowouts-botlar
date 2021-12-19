const {Client, Message} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Helper = require("../../Utils/Helper");

const PM = require("../../Managers/PenalManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Warn.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("Bunu yapmaya yetkin yetmiyor :c");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.reply(`Geçerli bir \`@Yulaf/ID\` belirtmelisin.`);
    
    let reason = args.splice(1).join(" ");
    if(!reason) return message.reply("Geçerli \`Uyarı\` sebebi belirtmelisin.");

    let member = await message.guild.getMember(victim.id);
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Senin rolünden üstte ya da aynı roldeki birisine ceza veremezsin.")

    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.WARN, reason);

    message.channel.csend(`${victim}, ${message.author} Tarafından __**${reason}**__ Sebebiyle sunucuda \`Uyarıldı\`, Ceza Numarası - (\`#${document.Id}\`) ${Settings.emojiler.tik}`)
    message.guild.log(message.author, victim, document, Settings.Penals.Warn.Log);
}

module.exports.settings = {
    Commands: ["warn", "uyarı", "uyar"],
    Usage: "warn <@user|id> [reason]",
    Description: "Bahsettiğin kişiyi sunucuda uyarırsın.",
    Category: "Penal",
    Activity: true
}