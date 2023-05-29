const {
    Client,
    Intents,
    Collection,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require('discord.js');

var os = require('os-utils');
const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);

module.exports = {
    name: 'status',
    description: 'Only for developers !',
    run: async (client, interaction) => {
        let data = await getLanguageData(interaction.guild.id);
        
        const config = require("../config.js")
        if (interaction.user.id != config.owner.ownerid1 || interaction.user.id != config.owner.ownerid2) {
            return interaction.reply({ content: data.status_be_bot_dev })
        };

        os.cpuUsage(function (c) {

            const embed = new EmbedBuilder()
                .setColor("#42ff08")
                .addFields(
                    { name: "=====================", value: '**Consumed in real time** :', inline: false },
                    { name: "**CPU USAGE:**", value: 'CPU Usage (%): **' + c + '** %', inline: false },
                    { name: "**RAM USAGE:**", value: 'MEMORY Usage (%): **' + os.freememPercentage() + '** %', inline: false },
                    { name: "=====================", value: '**Characteristic of the server** :', inline: false },
                    { name: "**TOTAL RAM:**", value: 'TOTAL RAM (MB): **' + os.totalmem() + '** MB', inline: false },
                    { name: "**CPU NAME:**", value: '**AMD RYZEN 7 5700G 8 CORE / 12 THREADS 4.6Ghz**', inline: false },
                    { name: "=====================", value: '`iHORIZON`', inline: false }
                )
                .setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) })

            return interaction.reply({ embeds: [embed] });
        })
        const filter = (interaction) => interaction.user.id === interaction.member.id;
    }
}