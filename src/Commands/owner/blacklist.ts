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
    Collection,
    ChannelType,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} from 'discord.js'

import { Command } from '../../../types/command';
import * as db from '../../core/functions/DatabaseModel';

export const command: Command = {
    name: 'blacklist',
    description: 'Add a user to the blacklist!',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to blacklist...',
            required: false
        },
        {
            name: 'forceid',
            type: ApplicationCommandOptionType.String,
            description: 'The user you want to blacklist...',
            required: false
        }
    ],
    category: 'owner',
    run: async (client: Client, interaction: any) => {
        let data = await client.functions.getLanguageData(interaction.guild.id);

        if (await db.DataBaseModel({ id: db.Get, key: `GLOBAL.OWNER.${interaction.user.id}.owner` }) !== true) {
            return interaction.reply({ content: data.blacklist_not_owner });
        };

        var text = "";
        const ownerList = await db.DataBaseModel({ id: db.All });

        for (var i in ownerList.find((item: { id: string; }) => item.id === 'GLOBAL').value.BLACKLIST) {
            text += `<@${i}>\n`;
        }

        let embed = new EmbedBuilder()
            .setColor('#2E2EFE').setAuthor({ name: 'Blacklist' }).setDescription(text || "No blacklist")
            .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() });

        const member = interaction.options.getMember('member');
        const force = interaction.options.getString('forceid');

        if (!member && !force) return interaction.reply({ embeds: [embed] });

        if (member) {
            if (member.user.id === client.user?.id) return interaction.reply({ content: data.blacklist_bot_lol });
            let fetched = await db.DataBaseModel({ id: db.Get, key: `GLOBAL.BLACKLIST.${member.user.id}` });

            if (!fetched) {
                await db.DataBaseModel({ id: db.Set, key: `GLOBAL.BLACKLIST.${member.user.id}`, value: { blacklisted: true } });
                if (member.bannable) {
                    member.ban({ reason: "blacklisted !" });
                    return interaction.reply({ content: data.blacklist_command_work.replace(/\${member\.user\.username}/g, member.user.username) });
                } else {
                    await db.DataBaseModel({ id: db.Set, key: `GLOBAL.BLACKLIST.${member.user.id}`, value: { blacklisted: true } });
                    return interaction.reply({ content: data.blacklist_blacklisted_but_can_ban_him });
                }
            } else {
                return interaction.reply({ content: data.blacklist_already_blacklisted.replace(/\${member\.user\.username}/g, member.user.username) });
            }
        } else if (force) {
            if (force === client.user?.id) return interaction.reply({ content: data.blacklist_bot_lol });
            await db.DataBaseModel({ id: db.Set, key: `GLOBAL.BLACKLIST.${force}`, value: { blacklisted: true } });
            return interaction.reply({ content: data.blacklist_command_work.replace(/\${member\.user\.username}/g, `<@${force}>`) });
        };
    },
};