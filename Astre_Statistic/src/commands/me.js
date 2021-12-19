const moment = require("moment");
require("moment-duration-format");
const conf = require("../configs/config.json");
const messageUserChannel = require("../schemas/messageUserChannel");
const voiceUserChannel = require("../schemas/voiceUserChannel");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const voiceUserParent = require("../schemas/voiceUserParent");
const coin = require("../schemas/coin");
const taggeds = require("../schemas/taggeds");

module.exports = {
	conf: {
		aliases: [],
		name: "me",
		help: "me",
		enabled: true
	},

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Array<string>} args
	 * @param {MessageEmbed} embed
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args, embed) => {
		const category = async (parentsArray) => {
			const data = await voiceUserParent.find({ guildID: message.guild.id, userID: message.author.id });
			const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
			let voiceStat = 0;
			for (var i = 0; i <= voiceUserParentData.length; i++) {
				voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
			}
			return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
		};

		const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: message.author.id }).sort({ channelData: -1 });
		const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: message.author.id }).sort({ channelData: -1 });
		const voiceLength = Active2 ? Active2.length : 0;
		let voiceTop;
		let messageTop;
		Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor.";
		Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``).join("\n") : voiceTop = "Veri bulunmuyor.";

		const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: message.author.id });
		const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: message.author.id });

		const messageDaily = messageData ? messageData.dailyStat : 0;
		const messageWeekly = messageData ? messageData.weeklyStat : 0;

		const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika] s [saniye]");
		const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika] s [saniye]");

		const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });

		const filteredParents = message.guild.channels.cache.filter((x) =>
			x.type === "category" &&
			!conf.publicParents.includes(x.id) &&
			!conf.registerParents.includes(x.id) &&
			!conf.solvingParents.includes(x.id) &&
			!conf.privateParents.includes(x.id) &&
			!conf.funParents.includes(x.id) &&
			!conf.musicParents.includes(x.id) &&
			!conf.streamerParents.includes(x.id) 

		);

		const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
		const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: message.author.id });
		let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
		currentRank = currentRank[currentRank.length-1];

		const coinStatus = conf.coinSystem && message.member.hasRole(conf.staffs, false) && client.ranks.length > 0 ?` : ""}
${client.progressBar(coinData ? coinData.coin : 0, maxValue.coin, 8)} **${coinData ? coinData.coin : 0} / ${maxValue.coin}**
${currentRank ? `` : ` 
**Yetki Durumun:**
${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\` coin daha kazanmanız gerekiyor!`}` : "";
	
embed.setColor('WHITE')
embed.setDescription(`
${message.author.toString()} (${message.member.roles.highest}) kişisinin sunucu verileri

**Ses Bilgileri:**
${conf.emojis.nokta} Toplam Ses Saatin: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`
${conf.emojis.nokta} Public Odalar Odaları: \`${await category(conf.publicParents)}\`
${conf.emojis.nokta} Kayıt Odaları: \`${await category(conf.registerParents)}\`
${conf.emojis.nokta} Secret Odalar: \`${await category(conf.privateParents)}\`
${conf.emojis.nokta} Sorun Çözme Odaları: \`${await category(conf.solvingParents)}\`
${conf.emojis.nokta} Diğer Odalar: \`${await category(filteredParents.map(x => x.id))}\`

**Mesaj Bilgileri:**
${conf.emojis.nokta} Haftalık Mesaj Verin: \`${messageData ? messageData.topStat : 0}\`

**Puan Bar Durumun:** ${coinStatus}`);
		message.channel.send(embed);
	}
};