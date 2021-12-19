const Discord = require("discord.js")
const db = require("quick.db")
module.exports.execute = async (client, message, args) => {
    // if(!message.member.roles.cache.has("Owner Rolü")) // Owner Rol ID girebilirsiniz
if(!message.member.roles.cache.has("OWNER")) return message.channel.send(new Discord.MessageEmbed().setDescription(`${message.member} Komutu kullanmak için yetkin bulunmamakta.`)).then(x => x.delete({timeout: 5500}));
let embed = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(message.guild.name, message.guild.iconURL({dynamic: true})).setTimestamp()
let member = args[0]
let data = await db.get(`unremovableBan.${message.guild.id}`)
if(data == null) await db.set(`unremovableBan.${message.guild.id}`, [])
if(args[0] == "liste") {
if(!data) return message.channel.send(embed.setDescription(`Herhangi biri kalkmaz ban ile yasaklanmamış.`)).then(x => x.delete({timeout: 7000}));
let banList = data.length > 0 ? `Kalkmaz ban ile banlanmış üyeler;\n\n${data.map(user => `\`${data.indexOf(user)+1}.\` ${user.tag} - (\`${user.id}\`)`).join("\n")}` : `**Bu özellikle banlanmış üye bulunamadı.**`
message.channel.send(embed.setDescription(`${banList}`))
return;
}
if(args[0] == "yardım") {
message.channel.send(embed.setDescription(`
\`kban id\`
\`kban liste\`
\`kban kaldır id\`
\`kban sıfırla\`
`))
return;
}
if(args[0] == "kaldır" || args[0] == "sil" || args[0] == "kunban") {
    if(!message.member.roles.cache.has("OWNER")) return message.channel.send(embed.setDescription(`Bu komutu sadece sunucu sahibi (${message.guild.owner}) kullanabilir.`))
let member = args[1]
if(!member || isNaN(member)) return message.channel.send(embed.setDescription(`Geçerli bir id girmelisiniz veya \`urb yardım\` yazarak komutlara bakabilirsiniz.`)).then(x => x.delete({timeout: 6500}));
let qwe = await client.users.fetch(member).catch(e => { })
if(!qwe) return message.channel.send(embed.setDescription(`Geçerli bir id girmelisiniz.`)).then(x => x.delete({timeout: 7000}));
if(!data.some(s => s.id == member)) return message.channel.send(embed.setDescription(`${qwe.id} - (\`${qwe.username}\`) kullanıcısının idsi zaten bulunmuyor.`)).then(x => x.delete({timeout: 6500}));
 db.set(`unremovableBan.${message.guild.id}`, await data.filter(s => s.id != member));
  await message.guild.members.unban(member).catch(e => { });
      message.channel.send(embed.setDescription(`${qwe.id} - (\`${qwe.tag}\`) kullanıcısının kalkmaz banı başarıyla kaldırıldı.`))
return;
}
if(args[0] == "sıfırla") {
    if(!message.member.roles.cache.has("OWNER")) return message.channel.send(embed.setDescription(`Bu komutu sadece sunucu sahibi (${message.guild.owner}) kullanabilir.`)).then(x => x.delete({timeout: 5000}));
await db.delete(`unremovableBan.${message.guild.id}`)
message.channel.send(embed.setDescription(`${message.author} \`unremovableBan\` özelliğiyle yasaklanmış tüm üyelerin yasağı kaldırıldı.`))
return;
}
if(!message.member.roles.cache.has("OWNER")) return message.channel.send(embed.setDescription(`Bu komutu sadece sunucu sahibi (${message.guild.owner}) kullanabilir.`))
if(!member || isNaN(member)) return message.channel.send(embed.setDescription(`Geçerli bir id girmelisiniz veya \`urb yardım\` yazarak komutlara bakabilirsiniz.`)).then(x => x.delete({timeout: 6500}));
let qwe = await client.users.fetch(member).catch(e => { })
if(!qwe) return message.channel.send(embed.setDescription(`Geçerli bir id girmelisiniz.`)).then(x => x.delete({timeout: 7000}));
if(data.some(s => s.id == member)) return message.channel.send(embed.setDescription(`${qwe.id} - (\`${qwe.username}\`) kullanıcısının idsi zaten bulunuyor.`)).then(x => x.delete({timeout: 6500}));
db.push(`unremovableBan.${message.guild.id}`, qwe)
if(message.guild.members.cache.has(qwe.id)) message.guild.member(qwe).ban({reason: "'unremovableBan' özelliği ile banlandı."}).catch(e => { })
message.channel.send(embed.setDescription(`${qwe.id} - (\`${qwe.tag}\`) kullanıcısı kalkmaz ban listesine eklendi.`))
};
module.exports.settings = {
    Commands: ["kalkmazban", "kban","kalkmaz-ban"],
    Usage: "kban",
    Description: "Bahsettiğin kanalda herkesi susturursun.",
    Category: "Criminal",
    Activity: true
}