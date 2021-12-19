const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const ayarlar = require('./ayarlar.json');
const korumalar = require('./Etkinlik/korumalar.json')
const fs = require('fs');
const { type } = require('os');

client.on("ready", async () => {
  client.user.setPresence({ activity: { name: ayarlar.BotStatus }, status: "dnd" });});

///--------------------------------- Yulaf Was Here ---------------------------------///

client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.Prefix)) return;
  if (message.author.id !== ayarlar.Developer && message.author.id !== message.guild.owner.id) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(ayarlar.Prefix.length);
  let embed = new MessageEmbed().setColor(ayarlar.EmbedRenk).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setTimestamp();
  
///--------------------------------- Eval Command ---------------------------------///

  if (command === "eval" && message.author.id === ayarlar.Developer) {
    if (!args[0]) return message.channel.send(`Kodu Belirtmelisin!`);
      let code = args.join(' ');
      function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
      message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) };
  };

if(command === "yetki") {
    let Yulaf= args[0]
    if(!Yulaf){message.channel.send("Yapılacak işlemi belirtmelisin.")}
    if(Yulaf == "Aç" || Yulaf == "aç" || Yulaf == "AÇ"){
      message.guild.roles.cache.get("").setPermissions(8)
      message.guild.roles.cache.get("").setPermissions(8)
      return message.channel.send(`Yetkiler başarıyla açıldı!`)
    }
    if(Yulaf == "Kapat" || Yulaf == "kapat" || Yulaf == "KAPAT"){
     let arr = ["ADMINISTRATOR","MANAGE_ROLES","KICK_MEMBERS","BAN_MEMBERS","MANAGE_CHANNELS","MANAGE_GUILD"];
     message.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true).map(t => t.setPermissions(0));
     message.channel.send(`Yetkiler başarıyla kapatıldı!`)
    }
      };

      if(command == "liste") {
        let hedef;
        let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
        let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (rol) hedef = rol;
        if (uye) hedef = uye;
        let guvenliler = ayarlar.whitelist || [];
        if (!hedef) return message.channel.send(embed
        .addField("Güvenli Liste (White List)",guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : g).join('\n ') : "Burası Çok Issız.."));};

  if(command === "restart") {
    message.channel.send("Bot Yeniden Başlatılıyor").then(msg => {
        console.log("[BOT] Yeniden başlatılıyor");
        process.exit(0);
});
};

    if(command === "güvenli") {
    let hedef;
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (rol) hedef = rol;
    if (uye) hedef = uye;
    let guvenliler = ayarlar.whitelist || [];
    if (!hedef) return message.channel.send(embed
     .setDescription(`Güvenli Listeye Eklemek/Kaldırmak İçin \`@Yulaf/ID\` Belirtmelisin.`));
    if (guvenliler.some(g => g.includes(hedef.id))) {
      guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
      ayarlar.whitelist = guvenliler;
      fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
        if (err) console.log(err);
      });
      message.channel.send(embed
      .setDescription(`${hedef}, ${message.author} Tarafından Güvenli Listeden \`Çıkarıldı.\``));
    } else {
      ayarlar.whitelist.push(`y${hedef.id}`);
      fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
        if (err) console.log(err);
      });
      message.channel.send(embed
       .setDescription(`${hedef}, ${message.author} Tarafından Güvenli Listeye \`Eklendi.\``));
    };
  };
});

function guvenli(kisiID) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  let guvenliler = ayarlar.whitelist || [];
  if (!uye || uye.id === client.user.id || uye.id === ayarlar.Developer || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
  else return false;
};

function cezalandir(kisiID, tur) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  if (!uye) return;
  if (tur == "jail") return uye.roles.cache.has(ayarlar.boosterRole) ? uye.roles.set([ayarlar.boosterRole, ayarlar.jailRole]) : uye.roles.set([ayarlar.jailRole]);
  if (tur == "ban") return uye.ban({ reason: "Yulaf Koruma Sistemi" }).catch();
};

client.on("guildMemberRemove", async member => {
  let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !korumalar.kickGuard) return;
  cezalandir(entry.executor.id, "ban");
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (logKanali) { logKanali.send(`🛡️ ${member} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Kick\` atıldı, @everyone`).catch(); }
  else { member.guild.owner.send(`🛡️ ${member} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Kick\` atıldı, @everyone`).catch(err => {}); };
});

client.on("guildBanAdd", async (guild, user) => {
  let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.banGuard) return;
   cezalandir(entry.executor.id, "ban");
  guild.members.unban(user.id, "Kullanıcıya Sağ Tık Ban Atıldığı İçin Banı Açıldı.").catch(console.error);
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`${members} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Ban\` atıldı, @everyone`).catch(); } 
  else {guild.owner.send(`🛡️ ${members} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Ban\` atıldı, @everyone`).catch(err => {}); };
});

client.on("guildMemberAdd", async member => {
  let entry = await member.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
  if (!member.user.bot || !entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !korumalar.botGuard) return;
  cezalandir(entry.executor.id, "ban");
  cezalandir(member.id, "ban");
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`🛡️ ${member} (\`${member.id}\`), adlı bot ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucuya \`Eklendi\`, @everyone`).catch(); }
  else{ member.guild.owner.send(`🛡️ ${member} (\`${member.id}\`), adlı bot ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucuya \`Eklendi\`, @everyone`).catch(err => {}); };
});

client.on("guildUpdate", async (oldGuild, newGuild) => {
  let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 3000 || guvenli(entry.executor.id) || !korumalar.serverGuard) return;
  cezalandir(entry.executor.id, "ban");
  if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
  if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından \`Sunucu Ayarları'nı\` güncellendi, @everyone`).catch(); }
  else { newGuild.owner.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından \`Sunucu Ayarları'nı\` güncellendi, @everyone `).catch(err => {}); };
});

client.on("webhookUpdate", async (channel) => {
  const entry = await channel.guild.fetchAuditLogs({type: 'WEBHOOK_CREATE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.webhookGuard) return;
 const webhooks = await channel.fetchWebhooks();
  await webhooks.map(x => x.delete({reason: "Yulaf || Webhook Sistemi"}))
  cezalandir(entry.executor.id, "ban");
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından izinsiz şekilde \`Webhook\` açıldı, @everyone`).catch(err => {}); };
});

client.on("emojiDelete", async (emoji, message) => {
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.emojiDelete) return;
  emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);
  cezalandir(entry.executor.id, "jail");
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından, \`Emoji\` silindi.`).catch(err => {}); };
});

client.on("emojiCreate", async (emoji, message) => {
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_CREATE" }).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.emojiCreate) return;
  emoji.delete({reason: "Yulaf | Emoji Koruma Sistemi"});
  cezalandir(entry.executor.id, "jail");
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından, \`Emoji\` yüklendi, @everyone`).catch(err => {}); };
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  if(oldEmoji === newEmoji) return;
  const entry = await oldEmoji.guild.fetchAuditLogs({ type: "EMOJI_UPDATE" }).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.emojiUpdate) return;
  cezalandir(entry.executor.id, "jail");
  await newEmoji.setName(oldEmoji.name);
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından, \`Emoji\` güncellendi, @everyone `).catch(err => {}); };
});

client.on("guildBanRemove", async(guild, user) => {
  let entry = await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then((audit) => audit.entries.first());
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.banRemove) return;
  cezalandir(entry.executor.id, "jail");
  guild.members.ban(entry.executor.id, { reason: "Banı Kaldırıldı Tekrar Atıldı || Yulaf Security System" });
  guild.members.ban(user.id, { reason: "Banı Kaldırıldı Tekrar Atıldı || Yulaf Security System" });
  let logKanali = client.channels.cache.find(a => a.name == "guard-log")
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı birisinin İzinsiz \`Banını\` kaldırdı, @everyone`).catch(err => {}); };
});


client.on('guildUpdate', async (oldGuild, newGuild) => {
  if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
  let entry = await newGuild.fetchAuditLogs({
      type: 'GUILD_UPDATE'
  }).then(audit => audit.entries.first());
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.Vanity_Guard) return;
  let channel = client.channels.cache.find(a => a.name == "guard-log");
  if (channel) channel.send(`️ ${entry.executor} ${entry.executor.id} Sunucunun Özel URL'sini değişti, @everyone`)
  if (!channel) newGuild.owner.send(`🛡️ ${entry.executor} ${entry.executor.id} Sunucunun Özel URL'sini değişti, @everyone`)
  newGuild.members.ban(entry.executor.id, {
      reason: `Url Guard | Yulaf.`
  });
  const settings = {
      url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
      body: {
          code: ayarlar.Vanity_URL
      },
      json: true,
      method: 'PATCH',
      headers: {
          "Authorization": `Bot ${ayarlar.Token}`
      }
  };
  request(settings, (err, res, body) => {
      if (err) {
          return console.log(err);
      }
  });
});
client.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
client.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
client.login(ayarlar.Token).then(x => console.log(`${client.user.tag} Bot Aktif`)).catch(err => console.error(`Bota Giriş Yapılamadı.!\n ∞ Hata : ${err}`))