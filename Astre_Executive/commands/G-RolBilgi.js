const Config = require('../config.json');
const Discord = require("discord.js"),
client = new Discord.Client();

module.exports.run = async (client, message, args) => {
let SatukEmbed = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(Config.Footer, message.guild.iconURL({dynamic: true}))
.setColor(Config.embedColor)


let SatukeRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]); 
if (!SatukeRole) return message.channel.send(SatukEmbed.setDescription(`${Config.false} Geçerli bir rol belirtmeli/Rol ID'si girmelisin.`))

  
let satArray = new Array();
let satukecimÜyeler = SatukeRole.members.forEach(satukecim => {satArray.push(`<@!${satukecim.id}> ( \`${satukecim.id}\` )`);})


message.channel.send(SatukEmbed.setDescription(`
${SatukeRole} (\`${SatukeRole.id}\`) adlı role ait bilgiler aşağıda verilmiştir.

${Config.Emoji} **Rol Rengi:** \`${SatukeRole.hexColor}\`
${Config.Emoji} **Rol ID'si:** \`${SatukeRole.id}\` 
${Config.Emoji} **Roldeki Kişi Sayısı**: \`${SatukeRole.members.size}\`


**Roldeki kişiler:**

${SatukeRole.members.size <= 15 ? satArray.join("\n") : `Bulamadım. ( **${SatukeRole.members.size}** kişi var! )`}
`))
  
};

module.exports.config = {
    name: "rolbilgi",
    description: "Rolün infolarını atar",
    usage: "rolbilgi",
    guildOnly: false,
    enabled: true,
    aliases: ["rb", "rolinfo","rol-bilgi"],
  };
