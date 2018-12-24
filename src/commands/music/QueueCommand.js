const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const DateHelper = require("../../helpers/DateHelper.js");
const MusicHelper = require("../../helpers/MusicHelper.js");


class QueueCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "queue",
            group: "music",
            memberName: "queue",
            description: "Mostra a fila de música."
        });
    }

    async run(msg, args) {
        if (!global.servers[msg.guild.id]) {
            return msg.channel.send(`Não existe músicas na fila para este servidor.`);
        }

        if (global.servers[msg.guild.id].queue.length == 0) {
            return msg.channel.send(`A fila para este servidor está vazia.`);
        }
    
        let currentServer = global.servers[msg.guild.id];
        let songPlaying = currentServer.queue[0];
        let answer = new Discord.RichEmbed()
            .setTitle(`Fila de ${msg.guild.name}`, ".")
            .setColor(config.botconfig.mainColor)
            .addField("Tocando agora", this.createStringSongInfo(0, songPlaying));

        let allSongs = "";
        let songInlineInfo;
        let totalQueueLength = 0;
        for (let i = 1; i < currentServer.queue.length; i++) {
            let song = currentServer.queue[i];
            totalQueueLength += parseInt(song.info.length_seconds);
            // video_url
            songInlineInfo = MusicHelper.createStringSongInfo(i, song);
            if (i < currentServer.queue.length - 1) {
                songInlineInfo += "\n\n";
            }
            allSongs += songInlineInfo;
        }

        if (allSongs) {
            answer.addField("Próximas:", allSongs);
        }

        let footerMsg = (totalQueueLength > 0) ? `${currentServer.queue.length - 1} músicas na fila | Tempo total de fila: ${DateHelper.fmtMSS(totalQueueLength)}` : `${currentServer.queue.length - 1} músicas na fila.`;

        // answer.setFooter(`${currentServer.queue.length - 1} músicas na fila | Tempo total de fila: ${DateHelper.fmtMSS(totalQueueLength)}`);
        answer.setFooter(footerMsg);
        msg.channel.send(answer);
    }
}

module.exports = QueueCommand;
