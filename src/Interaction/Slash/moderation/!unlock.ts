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
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionsBitField,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import logger from '../../../core/logger';

export = {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {

        let permission = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels);
        if (!permission) {
            await interaction.editReply({
                content: data.unlock_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };
        
        let embed = new EmbedBuilder()
            .setColor("#5b3475")
            .setTimestamp()
            .setDescription(data.unlock_embed_message_description);
        await (interaction.channel as BaseGuildTextChannel).permissionOverwrites.create(interaction.guild?.id as string, { SendMessages: true });

        try {
            let logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(data.unlock_logs_embed_title)
                .setDescription(data.unlock_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                    .replace(/\${interaction\.channel\.id}/g, interaction.channel?.id as unknown as string)
                )
            let logchannel = interaction.guild?.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');

            if (logchannel) {
                (logchannel as BaseGuildTextChannel).send({ embeds: [logEmbed] })
            }
        } catch (e: any) {
            logger.err(e)
        };

        await interaction.editReply({ embeds: [embed] });
        return;
    },
};