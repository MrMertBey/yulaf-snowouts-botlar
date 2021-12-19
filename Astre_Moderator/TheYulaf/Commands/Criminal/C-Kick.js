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
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Kick.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) 
    return message.reply("Bu komudunu kullanmaya yetkin yetmiyor.");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.reply(`Geçerli bir \`@Yulaf/ID\` belirtmelisin.`);
    
    let reason = args.splice(1).join(" ");
    if(!reason) return message.reply("Geçerli \`Kick\` sebebi belirtmelisin.");

    let member = await message.guild.getMember(victim.id);
    if(!member) return message.reply(`${victim} Bu üye sunucuda bulunamıyor`);
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Senden (Üst/Aynı) Roldeki birisini \`Kickleyemezsin.\`");

    if(member && !member.kickable) return message.reply("Botta Bir Hata Var \`Yulaf'a\` Ulaşınız.");

    member.kick(`Atan kişi: ${message.author.tag}`).catch();
    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.KICK, reason);

    message.channel.send(`${victim}, ${message.author} Tarafından \`${reason}\` Sebebiyle sunucudan \`Atıldı\`, Ceza Numarası - (\`#${document.Id}\`) ${Settings.emojiler.tik}`)
    message.react(Settings.emojiler.onayID)
    message.guild.log(message.author, victim, document, Settings.Penals.Kick.Log);
}

module.exports.settings = {
    Commands: ["kick", "at"],
    Usage: "kick <@member/id> [reason]",
    Description: "Bahsettiğin kişiyi sunucudan atarsın.",
    Category: "Criminal",
    Activity: true
}