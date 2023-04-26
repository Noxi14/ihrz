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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const yaml = require('js-yaml'), fs = require('fs');
const getLanguage = require(`${process.cwd()}/files/lang/getLanguage`);

module.exports = {
    name: 'setserverlang',
    description: 'Set the server lang to another',
    options: [
        {
            name: 'language',
            type: ApplicationCommandOptionType.String,
            description: 'What language you want ?',
            required: true,
            choices: [
                {
                    name: "English (Default)",
                    value: "en-US"
                },
                {
                    name: "Italian (Available)",
                    value: "it-IT"
                },
                {
                    name: "French (Soon)",
                    value: "fr-FR"
                },
                {
                    name: "Spain (No ETA)",
                    value: "es-ES"
                },
                {
                    name: "Deutsch (No ETA)",
                    value: "de-DE"
                }
            ],
        }
    ],
    run: async (client, interaction) => {
        let fileContents = fs.readFileSync(`${process.cwd()}/files/lang/${await getLanguage(interaction.guild.id)}.yml`, 'utf-8');
        let data = yaml.load(fileContents);

        let type = interaction.options.getString("language")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: data.setserverlang_not_admin });
        }

        try {
            logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(data.setserverlang_logs_embed_title_on_enable)
                .setDescription(data.setserverlang_logs_embed_description_on_enable.replace(/\${interaction\.user.id}/g, interaction.user.id))

            let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
            if (logchannel) { logchannel.send({ embeds: [logEmbed] }) }
        } catch (e) { console.error(e) };

        try {
            let already = await db.get(`${interaction.guild.id}.GUILD.LANG`)
            if (already) {
                if (already.lang === type) return interaction.reply({ content: data.setserverlang_already })
            }
            await db.set(`${interaction.guild.id}.GUILD.LANG`, { lang: type });

            return interaction.reply({ content: data.setserverlang_command_work_enable.replace(/\${type}/g, type) });

        } catch (e) {
            console.log(e)
            interaction.reply({ content: data.setserverlang_command_error_enable });
        }
    }
}