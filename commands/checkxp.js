const { SlashCommandBuilder } = require('@discordjs/builders');
const { totalXPToLevel, calculateCost } = require('../utils/calculator');  
module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkxp')
        .setDescription('Calculate the XP required to level up in Growtopia.')
        .addIntegerOption(option =>
            option.setName('current_level')
                .setDescription('Your current level')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('target_level')
                .setDescription('Your target level')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('speed')
                .setDescription('Select speed: fast or slow')
                .setRequired(true)
                .addChoices(
                    { name: 'Fast', value: 'fast' },
                    { name: 'Slow', value: 'slow' },
                )),
    async execute(interaction) {
        const currentLevel = interaction.options.getInteger('current_level');
        const targetLevel = interaction.options.getInteger('target_level');
        const speed = interaction.options.getString('speed') === 'fast';

        if (currentLevel < 1 || targetLevel > 125 || currentLevel >= targetLevel) {
            return interaction.reply('Please enter valid levels (1 <= current level < target level <= 125).');
        }

        const totalXP = totalXPToLevel(currentLevel, targetLevel);
        const { result, packs, conversionDetails } = calculateCost(totalXP, speed);

        const totalTimeMinutes = packs.totalTimeHours * 60;
        const hours = Math.floor(totalTimeMinutes / 60);
        const minutes = Math.round(totalTimeMinutes % 60);

        const embedMessage = {
            title: '🌟 **Growtopia XP & Pack Breakdown** 🌟',
            description: `This is what it will cost to get from level **\`${currentLevel}\`** to level **\`${targetLevel}\`**.`,
            color: 0x1f8b4c,  
            fields: [
                {
                    name: '💰 **Cost Breakdown**',
                    value: `Prime Packs: **${packs.primePacks}**\nHuge Packs: **${packs.hugePacks}**\nBig Packs: **${packs.bigPacks}**\nSmall Packs: **${packs.smallPacks}**`,
                    inline: true
                },
                {
                    name: '💸 **Total Cost**',
                    value: `**${packs.totalCostWL}** WLs (**${packs.totalCostDL}** DLs)`,
                    inline: true
                },
                {
                    name: '⏰ **Total Time**',
                    value: `**${packs.totalTimeHours.toFixed(2)}** hours (${speed ? 'Fast' : 'Slow'}) or **${hours} hours ${minutes} minutes**`,
                    inline: true
                },
                {
                    name: '🔄 **Pack Conversion Details**',
                    value: conversionDetails.length > 0 ? conversionDetails.join('\n') : 'No conversions applied.',
                    inline: false
                }
            ],
            footer: {
                text: 'Calculated by Growtopia XP Calculator | Powered by Verity-Bots.',
                icon_url: 'https://example.com/footer-icon.png',  // Replace with your logo
            },
            thumbnail: {
                url: 'https://example.com/thumbnail.png',  // Replace with your bot logo
            }
        };

        return interaction.reply({ embeds: [embedMessage] });
    },
};
