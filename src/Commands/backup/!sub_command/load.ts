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
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ComponentType,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

import { Command } from '../../../../types/command';
import * as db from '../../../core/functions/DatabaseModel';
import logger from '../../../core/logger';
import config from '../../../files/config';

import backup from 'discord-backup';
import ms from 'ms';

export = {
    run: async (client: Client, interaction: any, data: any) => {
        let backupID = interaction.options.getString('backup-id');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.editReply({ content: data.backup_dont_have_perm_on_load });
        };
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.editReply({ content: data.backup_i_dont_have_perm_on_load })
        };

        if (!backupID) {
            return interaction.editReply({ content: data.backup_unvalid_id_on_load });
        };

        if (backupID && !await db.DataBaseModel({ id: db.Get, key: `BACKUPS.${interaction.user.id}.${backupID}` })) {
            return interaction.editReply({ content: data.backup_this_is_not_your_backup });
        };

        await interaction.channel.send({ content: data.backup_waiting_on_load });

        backup.fetch(backupID).then(async () => {
            backup.load(backupID, interaction.guild).then(() => {
                backup.remove(backupID);
            }).catch((err) => {
                return interaction.channel.send({
                    content: data.backup_error_on_load
                        .replace("${backupID}", backupID)
                    , ephemeral: true
                });
            });
        }).catch((err) => {
            return interaction.channel.send({ content: `❌` });
        });
    },
}