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

const yaml = require('js-yaml');
const fs = require('fs');
const getLanguage = require(`${process.cwd()}/files/lang/getLanguage`);

module.exports = {
  name: 'addmoney',
  description: 'add money to the bank of the typed user',
  options: [
    {
      name: 'amount',
      type: ApplicationCommandOptionType.Number,
      description: 'amount of $ you want add',
      required: true
    },
    {
      name: 'member',
      type: ApplicationCommandOptionType.User,
      description: 'the member you want to add the money',
      required: true
    }
  ],
  run: async (client, interaction) => {
    let fileContents = fs.readFileSync(`${process.cwd()}/files/lang/${await getLanguage(interaction.guild.id)}.yml`, 'utf-8');
    let data = yaml.load(fileContents)

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply(data.addmoney_not_admin)
    }
    var amount = interaction.options.get("amount")
    let user = interaction.options.get("member")
    interaction.reply({ content: `Successfully added \`${amount.value}\`$ to <@${user.user.id}>` })
    await db.add(`${interaction.guild.id}.USER.${user.user.id}.ECONOMY.money`, amount.value)

    try {
      logEmbed = new EmbedBuilder()
        .setColor("#bf0bb9")
        .setTitle(data.addmoney_logs_embed_title)
        .setDescription(data.addmoney_logs_embed_description
          .replace(/\${interaction\.user\.id}/g, interaction.user.id)
          .replace(/\${amount\.value\.id}/g, amount.value)
          .replace(/\${user\.user\.id}/g, user.user.id)
          )

      let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
      if (logchannel) { logchannel.send({ embeds: [logEmbed] }) }
    } catch (e) { return };
  }
}