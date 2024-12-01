// utils/calculator.js

const { prices } = require('../config'); // Access current prices

// Function to calculate XP for each level
function calculateXP(level) {
    return 50 * (level * level + 2);  // XP formula as provided
}

// Function to calculate the total XP to level up
function totalXPToLevel(currentLevel, targetLevel) {
    let totalXP = 0;
    for (let level = currentLevel; level < targetLevel; level++) {
        totalXP += calculateXP(level);  // Add XP for each level
    }
    return totalXP;
}

// Function to calculate the cost and breakdown of XP into packs
function calculateCost(totalXP, isFast) {
    const { smallPackCost, bigPackCost, hugePackCost, primePackCost } = prices;

    const smallPackXP = 125000;
    const bigPackXP = 500000;
    const hugePackXP = 1100000;
    const primePackXP = 2000000;

    // Correct times based on your images
    const smallPackTime = 5;  // 5 minutes for small pack
    const bigPackTime = 15;   // 15 minutes for big pack
    const hugePackTime = 30;  // 30 minutes for huge pack
    const primePackTime = 30; // 30 minutes for prime pack

    let primePacks = Math.floor(totalXP / primePackXP);
    totalXP %= primePackXP;

    let hugePacks = Math.floor(totalXP / hugePackXP);
    totalXP %= hugePackXP;

    let bigPacks = Math.floor(totalXP / bigPackXP);
    totalXP %= bigPackXP;

    let smallPacks = Math.floor(totalXP / smallPackXP);

    // Apply the conversion logic:
    let conversionDetails = [];

    // 2 Big Packs = 1 Huge Pack
    if (bigPacks >= 2) {
        hugePacks += Math.floor(bigPacks / 2);  // Convert 2 big packs into huge packs
        bigPacks %= 2; // Keep the remainder big packs
        conversionDetails.push(`2 Big Packs = 1 Huge Pack (Converted)`);
    }

    // Big Pack + 2 Small Packs = 1 Huge Pack
    if (bigPacks >= 1 && smallPacks >= 2) {
        hugePacks += 1; // Convert 1 big pack + 2 small packs into 1 huge pack
        bigPacks -= 1; // Subtract the used big pack
        smallPacks -= 2; // Subtract the used small packs
        conversionDetails.push(`1 Big Pack + 2 Small Packs = 1 Huge Pack (Converted)`);
    }

    // Big Pack + 3 Small Packs = 1 Huge Pack
    if (bigPacks >= 1 && smallPacks >= 3) {
        hugePacks += 1; // Convert 1 big pack + 3 small packs into 1 huge pack
        bigPacks -= 1; // Subtract the used big pack
        smallPacks -= 3; // Subtract the used small packs
        conversionDetails.push(`1 Big Pack + 3 Small Packs = 1 Huge Pack (Converted)`);
    }

    // 3 Small Packs = 1 Big Pack
    if (smallPacks >= 3) {
        bigPacks += Math.floor(smallPacks / 3); // Convert every 3 small packs into 1 big pack
        smallPacks %= 3; // Keep the remainder small packs
        conversionDetails.push(`3 Small Packs = 1 Big Pack (Converted)`);
    }

    // 2 Small Packs = 1 Big Pack
    if (smallPacks >= 2) {
        bigPacks += Math.floor(smallPacks / 2); // Convert every 2 small packs into 1 big pack
        smallPacks %= 2; // Keep the remainder small packs
        conversionDetails.push(`2 Small Packs = 1 Big Pack (Converted)`);
    }

    // Calculating total costs and time
    let totalCostWL = primePacks * primePackCost + hugePacks * hugePackCost + bigPacks * bigPackCost + smallPacks * smallPackCost;
    let totalCostDL = totalCostWL / 100.0;

    let totalTimeMinutes = primePacks * primePackTime + hugePacks * hugePackTime + bigPacks * bigPackTime + smallPacks * smallPackTime;
    let totalTimeHours = totalTimeMinutes / 60.0;

    return {
        result: `Cost: **${primePacks}** Prime Packs, **${hugePacks}** Huge Packs, **${bigPacks}** Big Packs, **${smallPacks}** Small Packs\nTotal Cost: **${totalCostWL}** WLs (**${totalCostDL}** DLs)\nTotal Time: **${totalTimeHours.toFixed(2)}** hours (${isFast ? 'Fast' : 'Slow'})`,
        packs: { primePacks, hugePacks, bigPacks, smallPacks, totalCostWL, totalCostDL, totalTimeHours },
        conversionDetails: conversionDetails
    };
}

module.exports = { calculateXP, totalXPToLevel, calculateCost };
