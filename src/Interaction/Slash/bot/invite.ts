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
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ApplicationCommandType,
} from 'discord.js'

import { Command } from '../../../../types/command';

export const command: Command = {
    name: 'invite',

    description: 'Get the bot invite link!',
    description_localizations: {
        "fr": "Obtenir le lien d'invitations du bot iHorizon"
    },
    
    category: 'bot',
    thinking: false,
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        let data = await client.functions.getLanguageData(interaction.guild?.id);
        let pp = client.user?.displayAvatarURL();

        let button_add_me = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(data.invite_embed_title)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot`)

        let invites = new EmbedBuilder()
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || "#416fec")
            .setTitle(data.invite_embed_title)
            .setDescription(data.invite_embed_description)
            .setURL('https://discord.com/api/oauth2/authorize?client_id=' + client.user?.id + '&permissions=8&scope=bot')
            .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() })
            .setThumbnail((pp as string));

        let components = new ActionRowBuilder<ButtonBuilder>().addComponents(button_add_me);

        await interaction.reply({ embeds: [invites], components: [components] });
        return;
    },
};