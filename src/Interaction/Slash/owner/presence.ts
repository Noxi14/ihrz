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
    ApplicationCommandOptionType,
    ActivityType,
    ApplicationCommandType
} from 'discord.js'

import { Command } from '../../../../types/command';

export const command: Command = {
    name: 'presence',
    description: 'Set the presence of the bot !',
    options: [
        {
            name: 'type',
            type: ApplicationCommandOptionType.String,
            description: 'The type of activity you want!',
            required: true,
            choices: [
                {
                    name: 'Reset Status',
                    value: 'reset'
                },
                {
                    name: 'Streaming',
                    value: 'streaming'
                },
                {
                    name: 'Playing',
                    value: 'playing'
                },
                {
                    name: 'Listening',
                    value: 'listening'
                },
                {
                    name: 'Watching',
                    value: 'watching'
                },
            ]
        },
        {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            description: 'The activity text',
            required: true,
        },
    ],
    category: 'owner',
    thinking: true,
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: any) => {
        let action_1 = interaction.options.getString("type");
        let action_2 = interaction.options.getString("name");

        if (await client.db.get(`GLOBAL.OWNER.${interaction.user.id}.owner`)
            !== true) {

            await interaction.deleteReply();
            await interaction.followUp({ content: '❌', ephemeral: true });
            return;
        };

        switch (action_1) {
            case 'streaming':
                client.user?.setActivity(action_2, {
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/anaissaraiva"
                });
                await client.db.set(`BOT.PRESENCE`,
                    {
                        type: ActivityType.Streaming,
                        name: action_2
                    }
                );
                break;
            case 'watching':
                client.user?.setActivity(action_2,
                    {
                        type: ActivityType.Watching,
                        url: "https://www.twitch.tv/anaissaraiva"
                    }
                );
                await client.db.set(`BOT.PRESENCE`,
                    {
                        type: ActivityType.Watching,
                        name: action_2
                    }
                );
                break;
            case 'playing':
                client.user?.setActivity(action_2, {
                    type: ActivityType.Playing,
                    url: "https://www.twitch.tv/anaissaraiva"
                });
                await client.db.set(`BOT.PRESENCE`,
                    {
                        type: ActivityType.Playing,
                        name: action_2
                    }
                );
                break;
            case 'listening':
                client.user?.setActivity(action_2, {
                    type: ActivityType.Listening,
                    url: "https://www.twitch.tv/anaissaraiva"
                });
                await client.db.set(`BOT.PRESENCE`,
                    {
                        type: ActivityType.Listening,
                        name: action_2,
                        url: 'https://twitch.tv/anaissaraiva'
                    }
                );
                break;
            default:
                await client.db.delete(`BOT.PRESENCE`);
                break;
        };

        await interaction.editReply({ content: `✅` });
        return;
    },
};