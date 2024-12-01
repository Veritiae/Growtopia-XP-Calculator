const { SlashCommandBuilder } = require('@discordjs/builders');
const { prices } = require('../config');  // Access prices from config

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prices')
        .setDescription('Update the price of packs in Growtopia XP Calculator.')
        .addIntegerOption(option =>
            option.setName('small')
                .setDescription('Price for Small Pack (in WLs)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('big')
                .setDescription('Price for Big Pack (in WLs)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('huge')
                .setDescription('Price for Huge Pack (in WLs)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('prime')
                .setDescription('Price for Prime Pack (in WLs)')
                .setRequired(false)),
    async execute(interaction) {
        // Check if the user has the required role
        const roleID = prices.priceRole;
        if (!interaction.member.roles.cache.has(roleID)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const small = interaction.options.getInteger('small');
        const big = interaction.options.getInteger('big');
        const huge = interaction.options.getInteger('huge');
        const prime = interaction.options.getInteger('prime');

        // Update the prices in the config object
        if (small) prices.smallPackCost = small;
        if (big) prices.bigPackCost = big;
        if (huge) prices.hugePackCost = huge;
        if (prime) prices.primePackCost = prime;

        // Send confirmation message
        const embed = {
            title: '💰 Pack Prices Updated',
            description: 'The prices for the packs have been updated.',
            color: 0x1f8b4c,
            fields: [
                { name: 'Small Pack Cost', value: `${prices.smallPackCost} WLs`, inline: true },
                { name: 'Big Pack Cost', value: `${prices.bigPackCost} WLs`, inline: true },
                { name: 'Huge Pack Cost', value: `${prices.hugePackCost} WLs`, inline: true },
                { name: 'Prime Pack Cost', value: `${prices.primePackCost} WLs`, inline: true },
            ],
        };

        return interaction.reply({ embeds: [embed] });
    },
};
