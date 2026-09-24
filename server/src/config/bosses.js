const Boss = require('../models/boss.model');

const initialBosses = [
  ['pompey', '01', 'POMPEY', 'Corrupted Overlord', 'PompeyW', 'Pompey is a relentless close-range threat. Keep your distance, force it to reposition, and punish every overcommitment.'],
  ['priest', '02', 'PRIEST', '', 'logo2', 'Priest controls the fight through support and recovery. Interrupt its rhythm before the arena becomes a war of attrition.'],
  ['nightmare', '03', 'NIGHTMARE', '', 'logo3', 'Nightmare turns visibility into a weapon. Stay calm, read movement cues, and never chase blindly into darkness.'],
  ['butcher', '04', 'BUTCHER', '', 'logo4', 'Butcher is a relentless close-range threat. Keep your distance, force it to reposition, and punish every overcommitment.'],
  ['complex', '05', 'COMPLEX', '', 'logo5', 'Complex changes the rules mid-fight. Adapt to each phase quickly and the arena becomes an advantage.'],
  ['bringer', '06', 'BRINGER', '', 'logo', 'Bringer arrives with overwhelming force and little warning. The only safe response is disciplined movement.'],
  ['girtallu', '07', 'GIRTALLU', '', 'PompeyW', 'Girtallu is the final test: quick, precise, and unforgiving. Every mistake compounds, so make each action deliberate.']
].map(([slug, number, name, subtitle, imageKey, intro]) => ({
  slug,
  number,
  name,
  subtitle,
  imageKey,
  intro,
  weaknesses: ['placeholder for user input'],
  resistances: ['placeholder for user input'],
  recommendedSpecialties: ['placeholder for user input'],
  mechanics: 'placeholder for user input'
}));

const ensureBossCatalog = async () => {
  await Promise.all(initialBosses.map(boss => Boss.updateOne(
    { slug: boss.slug },
    { $setOnInsert: boss },
    { upsert: true }
  )));
  console.log(`Boss catalog ready: ${initialBosses.length} records checked`);
};

module.exports = ensureBossCatalog;
