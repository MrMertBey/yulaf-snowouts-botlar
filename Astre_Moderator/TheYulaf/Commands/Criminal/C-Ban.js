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
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Ban.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("Bunu yapmaya yetkin yetmiyor :c");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.reply(`Geçerli bir \`@Yulaf/ID\` belirtmelisin`);
    
    let reason = args.splice(1).join(" ");
    if(!reason) return message.reply("Geçerli \`Ban\` sebebi belirtmelisin.");

    let member = await message.guild.getMember(victim.id);
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Senin rolünden üstte ya da aynı roldeki birisini yasaklayamazsın..");
    if(member && !member.bannable) return message.reply("Botta Bir Hata Var \`Yulaf'a\` Ulaşınız.")
    message.guild.members.ban(victim.id, {
        reason: `(${reason})`
    }).catch();

    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.BAN, reason);
    message.channel.send(`${victim}, ${message.author} tarafından **__${reason}__** sebebiyle sunucudan yasaklandı, Ceza Numarası - (\`#${document.Id}\`) ${Settings.emojiler.tik}`)
    message.react(Settings.emojiler.onayID)
    message.guild.log(message.author, victim, document, Settings.Penals.Ban.Log);
}

module.exports.settings = {
    Commands: ["ban", "cezalandır","yak","yasakla","yargı","yargi"],
    Usage: "ban <@user|id> [reason]",
    Description: "Bahsettiğin kişiyi sunucudan yasaklarsın.",
    Category: "Criminal",
    Activity: true
}