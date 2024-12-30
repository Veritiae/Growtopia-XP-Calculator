
const { prices } = require('../config'); 

function calculateXP(level) {
    return 50 * (level * level + 2);  
}

function totalXPToLevel(currentLevel, targetLevel) {
    let totalXP = 0;
    for (let level = currentLevel; level < targetLevel; level++) {
        totalXP += calculateXP(level);  
    }
    return totalXP;
}

function calculateCost(totalXP, isFast) {
    const { smallPackCost, bigPackCost, hugePackCost, primePackCost } = prices;

    const smallPackXP = 125000;
    const bigPackXP = 500000;
    const hugePackXP = 1100000;
    const primePackXP = 2000000;

    const smallPackTime = 5;  
    const bigPackTime = 15;   
    const hugePackTime = 30;  
    const primePackTime = 30; 

    let primePacks = Math.floor(totalXP / primePackXP);
    totalXP %= primePackXP;

    let hugePacks = Math.floor(totalXP / hugePackXP);
    totalXP %= hugePackXP;

    let bigPacks = Math.floor(totalXP / bigPackXP);
    totalXP %= bigPackXP;

    let smallPacks = Math.floor(totalXP / smallPackXP);

    let conversionDetails = [];

    if (bigPacks >= 2) {
        hugePacks += Math.floor(bigPacks / 2);  
        bigPacks %= 2;
        conversionDetails.push(`2 Big Packs = 1 Huge Pack (Converted)`);
    }

    if (bigPacks >= 1 && smallPacks >= 2) {
        hugePacks += 1; 
        bigPacks -= 1; 
        smallPacks -= 2; 
        conversionDetails.push(`1 Big Pack + 2 Small Packs = 1 Huge Pack (Converted)`);
    }

    if (bigPacks >= 1 && smallPacks >= 3) {
        hugePacks += 1; 
        bigPacks -= 1; 
        smallPacks -= 3; 
        conversionDetails.push(`1 Big Pack + 3 Small Packs = 1 Huge Pack (Converted)`);
    }

    if (smallPacks >= 3) {
        bigPacks += Math.floor(smallPacks / 3);
        smallPacks %= 3; 
        conversionDetails.push(`3 Small Packs = 1 Big Pack (Converted)`);
    }

    if (smallPacks >= 2) {
        bigPacks += Math.floor(smallPacks / 2);
        smallPacks %= 2; 
        conversionDetails.push(`2 Small Packs = 1 Big Pack (Converted)`);
    }

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
