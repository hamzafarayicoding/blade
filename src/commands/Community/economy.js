const {
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const ecoSchema = require('../../Schemas.js/economySchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('Create your economy account!'),
  async execute(interaction) {
    const { user, guild } = interaction;

    let Data = await ecoSchema.findOne({
      Guild: interaction.guild.id,
      User: interaction.user.id,
    });

    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('Account')
      .setDescription(`Choose your option`)
      .addFields({ name: 'Create', value: `Create your account` })
      .addFields({ name: 'Delete', value: `Delete your account` });

    const embed2 = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('Created your account')
      .setDescription(`Choose your option`)
      .addFields({
        name: 'Success',
        value: `Your account has been created! You've got ¥1000 upon creating your account.`,
      })
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    const embed3 = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('Deleted your account')
      .setDescription(`Choose your option`)
      .addFields({
        name: 'Success',
        value: `Your account has been deleted... yare yare.. brokie 😹👎`,
      })
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('page1')
        .setEmoji('✅')
        .setLabel('Create')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('page2')
        .setEmoji('❌')
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger)
    );

    const message = await interaction.reply({
      embeds: [embed],
      components: [button],
    });

    const collector = await message.createMessageComponentCollector();

    collector.on('collect', async (i) => {
      if (i.customId === 'page1') {
        if (i.user.id !== interaction.user.id) {
          return i.reply({
            content: `Only ${interaction.user.tag} can use this button.`,
            ephemeral: true,
          });
        }

        Data = new ecoSchema({
          Guild: interaction.guild.id,
          User: user.id,
          Bank: 0,
          Wallet: 1000,
        });

        await Data.save();

        await i.update({ embeds: [embed2], components: [] });
      }

      if (i.customId === 'page2') {
        if (i.user.id !== interaction.user.id) {
          return i.reply({
            content: `Only ${interaction.user.tag} can use this button.`,
            ephemeral: true,
          });
        }

        await Data.deleteMany();

        await i.update({ embeds: [embed3], components: [] });
      }
    });
  },
};
