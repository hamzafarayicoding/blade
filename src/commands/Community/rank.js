const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const levelSchema = require('../../Schemas.js/level');
const CanvaCord = require('canvacord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`rank`)
    .setDescription("Gets a member's rank in the server.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(`The member you want to check the rank of.`)
        .setRequired(false)
    ),
  async execute(interaction) {
    const { options, user, guild } = interaction;

    const Member = options.getMember('user') || user;

    const member = guild.members.cache.get(Member.id);

    const Data = await levelSchema.findOne({
      Guild: guild.id,
      User: member.id,
    });

    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setDescription(`:white_check_mark: ${member} has no gained any XP yet.`);

    if (!Data) return await interaction.reply({ embeds: [embed] });

    await interaction.deferReply();

    const Required = Data.Level * Data.Level * 20 + 20;

    const rank = new CanvaCord.Rank()
      .setAvatar(member.displayAvatarURL({ forceStatic: true }))
      .setBackground('IMAGE', 'https://images5.alphacoders.com/941/941369.png')
      .setCurrentXP(Data.XP)
      .setRequiredXP(Required)
      .setRank(1, 'Rank', false)
      .setLevel(Data.Level, 'Level')
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator);

    const Card = await rank.build();

    const attachment = await new AttachmentBuilder(Card, { name: 'rank.png' });

    const embed2 = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle(`${member.user.username}'s Level / Rank`)
      .setImage('attachment://rank.png');

    await interaction.editReply({ embeds: [embed2], files: [attachment] });
  },
};
