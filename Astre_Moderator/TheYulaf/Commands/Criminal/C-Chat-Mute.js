const {Client, Message} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Helper = require("../../Utils/Helper");

const ms = require("ms");

const PM = require("../../Managers/PenalManager");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Mute.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("Bunu yapmaya yetkin yetmiyor :c");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.reply(`Geçerli bir \`@Yulaf/ID\` belirtmelisin`);
    
    let time = args[1];
    if(!time || !ms(time)) return message.reply("Lütfen geçerli bir süre girin.");
    time = ms(time);
    
    let reason = args.splice(2).join(" ");
    if(!reason) return message.reply("Geçerli \`Mute\` sebebi belirtmelisin.");

    let member = await message.guild.getMember(victim.id);
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Senin rolünden üstte ya da aynı roldeki birisini susturamazsın.")

    if(member && member.manageable && !member.roles.cache.has(Settings.Penals.Mute.Role)) member.roles.add(Settings.Penals.Mute.Role).catch();

    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.TEMP_MUTE, reason, true, Date.now(), time);

    message.channel.send(`${victim}, ${message.author} tarafından **__${reason}__** sebebiyle geçici olarak metin kanallarında susturuldu, Ceza Numarası - (\`#${document.Id}\`) ${Settings.emojiler.tik}`)
    message.react(Settings.emojiler.onayID)
    message.guild.log(message.author, victim, document, Settings.Penals.Mute.Log);
}

module.exports.settings = {
    Commands: ["mute", "sustur"],
    Usage: "mute <@user|id> [reason]",
    Description: "Bahsettiğin kişiyi sunucuda geçici olarak susturursun.",
    Category: "Criminal",
    Activity: true
}