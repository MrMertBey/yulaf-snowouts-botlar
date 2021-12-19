const Discord = require("discord.js"),
client = new Discord.Client(); 

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

 module.exports.execute = async (client, message, args) => {

    if (!args[0]) return message.channel.send(`Zar atmak için \`.zar 6\`, \`.zar 20\` veya \`.zar çift\` yazmanız gerek.`);
  
if (args[0] == '6')  {message.channel.send('Zar atılıyor..').then(a => {
var zar6 = ['1', '2', '3', '4', '5', '6'];
setTimeout(() => {
a.edit(`Zar atıldı. Çıkan sonuç: \`${Math.floor(Math.random()*zar6.length)}\` Abi şunu fark ediyorsun..`)
}, 1000);
})}
  
 else if (args[0] == '20') {message.channel.send('Zar atılıyor..').then(a => {
    var zar20 = ['1', '2', '3', '4', '5', '6',"7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
    setTimeout(() => {
a.edit(`Zar atıldı. Çıkan sonuç: \`${Math.floor(Math.random()*zar20.length)}\` Abi şunu fark ediyorsun..`)
}, 1000);
    
  })}
  
 else if (args[0] == "çift") {message.channel.send("Zar atılıyor..").then(a => {
    var zar1 = ["1", "2", "3", "4", "5", "6"];
    var zar2 = ["1", "2", "3", "4", "5", "6"];
    setTimeout(() => {
      a.edit(`Zar atıldı. Çıkan sonuç: \`${Math.floor(Math.random()*zar1.length)}\` \`${Math.floor(Math.random()*zar2.length)}\` Abi şunu fark ediyorsun..`)
    }, 1000);
  })}
  else {
    message.channel.send(`Zar atmak için \`.zar 6\`, \`.zar 20\` veya \`.zar çift\` yazmanız gerek.`);
  }
};

module.exports.settings = {
    Commands: ["zarat"],
    Usage: "Zarat",
    Description: "Bahsettiğin kişiyi sunucudan atarsın.",
    Category: "Funny",
    Activity: true
}