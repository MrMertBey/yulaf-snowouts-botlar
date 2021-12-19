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
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Jail.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.reply("Bunu yapmaya yetkin yetmiyor :c");

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.reply(`Geçerli bir \`@Yulaf/ID\` belirtmelisin.`);
    
    let reason = `Reklam`
    
    let member = await message.guild.getMember(victim.id);
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("senin rolünden üstte ya da aynı roldeki birisine ceza veremezsin.")

    if(member && member.manageable) PM.setRoles(member, Settings.Penals.Jail.Role);

    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.REKLAM, reason);

    message.channel.send(`${victim}, ${message.author} Tarafından sunucuda \`Reklam\` yaptığı için cezalandırıldı, Ceza Numarası - (\`#${document.Id}\`) ${Settings.emojiler.tik}`)
    message.guild.log(message.author, victim, document, Settings.Penals.Jail.Log);
}

module.exports.settings = {
    Commands: ["Reklam","reklam"],
    Usage: "reklam <@user|id> ",
    Description: "Bahsettiğin kişiyi sunucuda kalıcı olarak cezalandırırsın.",
    Category: "Penal",
    Activity: true
}