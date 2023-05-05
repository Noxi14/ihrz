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

const yaml = require('js-yaml'), fs = require('fs');
const getLanguage = require(`${process.cwd()}/files/lang/getLanguage`);

module.exports = {
    name: 'kick',
    description: 'kick a member in guild',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,
            description: 'the member you want to kick',
            required: true
        }
    ],
    run: async (client, interaction) => {
        let fileContents = fs.readFileSync(`${process.cwd()}/files/lang/${await getLanguage(interaction.guild.id)}.yml`, 'utf-8');
        let data = yaml.load(fileContents);
        
        const member = interaction.options.getMember("member")
        const permission = interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
        if (!permission) return interaction.reply({ content: data.kick_not_permission });
        if (!interaction.guild.members.me.permissions.has([PermissionsBitField.Flags.KickMembers])) {
            return interaction.reply({ content: data.kick_dont_have_permission })
        }
        if (member.user.id === interaction.member.id) {
            return interaction.reply({ content: data.kick_attempt_kick_your_self })
        };

        if (interaction.member.roles.highest.position < member.roles.highest.position) {
            return interaction.reply({ content: data.kick_attempt_kick_higter_member });
        }
        member.send({
            content: data.kick_message_to_the_banned_member
                .replace(/\${interaction\.guild\.name}/g, interaction.guild.name)
                .replace(/\${interaction\.member\.user\.username}/g, interaction.member.user.username)
                .replace(/\${interaction\.member\.user\.discriminator}/g, interaction.member.user.discriminator)
        })
        .catch(() => {})
            .then(() => {
                member.kick({ reason: 'kicked by ' + interaction.user.username })
                    .then((member) => {
                        interaction.reply({
                            content: data.kick_command_work
                                .replace(/\${member\.user}/g, member.user)
                                .replace(/\${interaction\.user}/g, interaction.user)
                        })
                        try {
                            logEmbed = new EmbedBuilder()
                                .setColor("#bf0bb9")
                                .setTitle(data.kick_logs_embed_title)
                                .setDescription(data.kick_logs_embed_description
                                    .replace(/\${member\.user\.id}/g, member.user.id)
                                    .replace(/\${interaction\.member\.id}/g, interaction.member.id)
                                );

                            let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
                            if (logchannel) { logchannel.send({ embeds: [logEmbed] }) }
                        } catch (e) { console.error(e) };
                    })

            })
    }
};