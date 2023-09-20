/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2023 iHorizon
*/

import {
    Client,
    EmbedBuilder,
    PermissionsBitField,
} from 'discord.js';

import * as db from '../../core/functions/DatabaseModel';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let Lockembed = new EmbedBuilder()
            .setColor(await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color.mod-cmd` }) || "#5b3475")
            .setTimestamp()
            .setDescription(data.lock_embed_message_description
                .replace(/\${interaction\.user\.id}/g, interaction.user.id)
            );

        let permission = interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages);

        if (!permission) {
            await interaction.editReply({ content: data.lock_dont_have_permission });
            return;
        };

        interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false }).then(() => {
            interaction.editReply({ embeds: [Lockembed] });
        }).catch(() => { })

        try {
            let logEmbed = new EmbedBuilder()
                .setColor(await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color.ihrz-logs` }) || "#bf0bb9")
                .setTitle(data.lock_logs_embed_title)
                .setDescription(data.lock_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                    .replace(/\${interaction\.channel\.id}/g, interaction.channel.id)
                );
            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');

            if (logchannel) {
                logchannel.send({ embeds: [logEmbed] });
            };
        } catch (e) {
            return;
        };
    },
};