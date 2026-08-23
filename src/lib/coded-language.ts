import { CodedTerm, SeverityLevel } from './types';

export const codedLanguageDictionary: Record<string, CodedTerm> = {
  // --- Dog Whistles and Genocidal References ---
  'remove kebab': {
    term: 'remove kebab',
    meaning: 'A genocidal slogan originally used by Serb nationalists during the Bosnian War.',
    context: 'Originated from a propaganda music video. It has been adopted by global alt-right and neo-Nazi groups as a dog whistle to call for the ethnic cleansing or murder of Muslims.',
    severity: SeverityLevel.CRITICAL,
    category: 'dog_whistles'
  },
  'kebab': {
    term: 'kebab',
    meaning: 'A dehumanizing slur used to refer to Muslims.',
    context: 'Derived from "remove kebab", reducing a diverse religious group to a food item associated with the Middle East and South Asia to dehumanize them.',
    severity: SeverityLevel.HIGH,
    category: 'dehumanization'
  },
  'deus vult': {
    term: 'deus vult',
    meaning: 'Latin for "God wills it," originally a Crusader battle cry.',
    context: 'Co-opted by white nationalists, the alt-right, and Islamophobes to frame modern geopolitical or social issues as a continuation of the Crusades and a holy war against Muslims.',
    severity: SeverityLevel.HIGH,
    category: 'dog_whistles'
  },
  'reconquista': {
    term: 'reconquista',
    meaning: 'Historical term for the Christian conquest of the Iberian Peninsula from Muslim rule.',
    context: 'Used by far-right groups to advocate for the expulsion of Muslims from Europe or Western countries.',
    severity: SeverityLevel.MEDIUM,
    category: 'political_coded'
  },

  // --- Demographic and Conspiracy Terms ---
  'great replacement': {
    term: 'great replacement',
    meaning: 'A white nationalist conspiracy theory.',
    context: 'Claims that white European populations are being deliberately replaced by non-white, often specifically Muslim, immigrants through demographic growth and immigration policies.',
    severity: SeverityLevel.CRITICAL,
    category: 'conspiracy_terms'
  },
  'eurabia': {
    term: 'eurabia',
    meaning: 'An Islamophobic conspiracy theory.',
    context: 'Posits a deliberate plot by globalists and Muslim leaders to Islamize Europe, subvert its culture, and subjugate its non-Muslim population.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'creeping sharia': {
    term: 'creeping sharia',
    meaning: 'The baseless claim that Islamic law is secretly infiltrating Western legal systems.',
    context: 'Used to stoke fear about Muslim immigrants and block the building of mosques or the political participation of Muslims.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'taqiyya': {
    term: 'taqiyya',
    meaning: 'An Islamic concept of concealing one\'s belief to avoid persecution.',
    context: 'Misused by Islamophobes to falsely claim that all Muslims are commanded to lie to non-Muslims as part of a plot to take over the West. Used to discredit any moderate or progressive Muslim voices.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'civilizational jihad': {
    term: 'civilizational jihad',
    meaning: 'A conspiracy theory alleging a stealth takeover of Western society.',
    context: 'Claims that Muslims are using democratic institutions, education, and civil rights to destroy Western civilization from within.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'demographic jihad': {
    term: 'demographic jihad',
    meaning: 'The conspiracy that Muslims aim to conquer nations through high birth rates.',
    context: 'Used to justify forced deportations, discriminatory immigration bans, and violence against Muslim families.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'love jihad': {
    term: 'love jihad',
    meaning: 'An Islamophobic conspiracy theory prevalent in India.',
    context: 'Claims Muslim men are running a coordinated campaign to feign love and marry Hindu women in order to convert them to Islam. Used to justify violence against interfaith couples.',
    severity: SeverityLevel.CRITICAL,
    category: 'conspiracy_terms'
  },
  'land jihad': {
    term: 'land jihad',
    meaning: 'A conspiracy theory claiming Muslims are buying up land to take over regions.',
    context: 'Used primarily in India to advocate for economic boycotts and prevent Muslims from purchasing property or running businesses.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },

  // --- Dehumanization and Slurs ---
  'muzzie': {
    term: 'muzzie',
    meaning: 'A derogatory slur for a Muslim.',
    context: 'Commonly used in Australia, the UK, and online forums as a diminutive but highly offensive term.',
    severity: SeverityLevel.HIGH,
    category: 'coded_slurs'
  },
  'musrat': {
    term: 'musrat',
    meaning: 'A portmanteau of Muslim and rat.',
    context: 'Overtly dehumanizing language comparing Muslims to vermin, mirroring genocidal propaganda techniques.',
    severity: SeverityLevel.CRITICAL,
    category: 'dehumanization'
  },
  'mudslime': {
    term: 'mudslime',
    meaning: 'A derogatory play on the word Muslim.',
    context: 'Used online to associate Muslims with dirt, slime, and subhuman characteristics.',
    severity: SeverityLevel.CRITICAL,
    category: 'dehumanization'
  },
  'goat fucker': {
    term: 'goat fucker',
    meaning: 'A racist and Islamophobic trope.',
    context: 'Used to depict Muslims or Middle Easterners as backward, uncivilized, and engaged in bestiality.',
    severity: SeverityLevel.HIGH,
    category: 'dehumanization'
  },
  'towelhead': {
    term: 'towelhead',
    meaning: 'A racial slur targeting people who wear turbans, keffiyehs, or hijabs.',
    context: 'Targets Muslims, Sikhs, and Arabs, mocking traditional or religious headwear.',
    severity: SeverityLevel.HIGH,
    category: 'coded_slurs'
  },
  'raghead': {
    term: 'raghead',
    meaning: 'Similar to towelhead, a slur targeting religious headwear.',
    context: 'Highly offensive term used to denigrate Muslims and Arabs.',
    severity: SeverityLevel.HIGH,
    category: 'coded_slurs'
  },
  'sand nigger': {
    term: 'sand nigger',
    meaning: 'An extreme racial slur combining anti-Black racism with anti-Arab/anti-Muslim bigotry.',
    context: 'Used to demean Arabs, Muslims, and Middle Easterners by associating them with a harsh environment and using a historic anti-Black slur.',
    severity: SeverityLevel.CRITICAL,
    category: 'coded_slurs'
  },

  // --- South Asian Specific (Hindi/Urdu/Indian context) ---
  'katwa': {
    term: 'katwa',
    meaning: 'A highly offensive Hindi/Urdu slur mocking male circumcision.',
    context: 'Widely used in South Asia by Hindu nationalists to demean and mock Muslim men.',
    severity: SeverityLevel.CRITICAL,
    category: 'coded_slurs'
  },
  'mulla': {
    term: 'mulla',
    meaning: 'Originally a term for a religious scholar, weaponized as a slur.',
    context: 'In Indian political discourse, used derogatorily to stereotype all Muslims as religious extremists or backwards.',
    severity: SeverityLevel.MEDIUM,
    category: 'coded_slurs'
  },
  'jihadi': {
    term: 'jihadi',
    meaning: 'Someone engaged in jihad.',
    context: 'Often misapplied broadly to any Muslim individual, activist, or community leader to falsely associate them with terrorism.',
    severity: SeverityLevel.HIGH,
    category: 'coded_slurs'
  },
  'peacefuls': {
    term: 'peacefuls',
    meaning: 'Sarcastic term used to refer to Muslims.',
    context: 'Used ironically online to imply that Islam is not a "religion of peace" and that Muslims are inherently violent.',
    severity: SeverityLevel.MEDIUM,
    category: 'dog_whistles'
  },
  'abdul': {
    term: 'abdul',
    meaning: 'A common Arabic name, used as a generic, pejorative stand-in for any Muslim man.',
    context: 'Used online to stereotype Muslim men as terrorists, misogynists, or uneducated.',
    severity: SeverityLevel.MEDIUM,
    category: 'coded_slurs'
  },
  'bulla': {
    term: 'bulla',
    meaning: 'A derogatory rhyme/slur used in India.',
    context: 'Often used on social media to avoid automated filters when attacking Muslims.',
    severity: SeverityLevel.HIGH,
    category: 'coded_slurs'
  },
  'termites': {
    term: 'termites',
    meaning: 'A dehumanizing term comparing immigrants/Muslims to pests.',
    context: 'Used by some political leaders in South Asia to refer to Muslim refugees (e.g., Rohingya or Bangladeshi immigrants), laying the groundwork for ethnic cleansing.',
    severity: SeverityLevel.CRITICAL,
    category: 'dehumanization'
  },

  // --- French / European Specific ---
  'islamogauchisme': {
    term: 'islamogauchisme',
    meaning: 'French for "Islamo-leftism".',
    context: 'A political smear in France used to delegitimize left-wing politicians, academics, or activists by falsely claiming they are allied with Islamist extremism.',
    severity: SeverityLevel.MEDIUM,
    category: 'political_coded'
  },
  'grand remplacement': {
    term: 'grand remplacement',
    meaning: 'French origin of the "Great Replacement" theory.',
    context: 'Coined by Renaud Camus, it is the foundational text for modern white supremacist replacement theories targeting Muslims in Europe.',
    severity: SeverityLevel.CRITICAL,
    category: 'conspiracy_terms'
  },
  'racailles': {
    term: 'racailles',
    meaning: 'French for "scum" or "rabble".',
    context: 'Often heavily racially coded in France to refer to youth of North African (Maghreb) or Muslim descent in the banlieues (suburbs).',
    severity: SeverityLevel.MEDIUM,
    category: 'dog_whistles'
  },

  // --- Emojis and Typographic Substitutions ---
  '🥓': {
    term: '🥓',
    meaning: 'Bacon emoji.',
    context: 'Used as a form of harassment against Muslims (who do not eat pork), often spammed in the comments of Muslim creators to mock their faith.',
    severity: SeverityLevel.LOW,
    category: 'dog_whistles'
  },
  '🐷': {
    term: '🐷',
    meaning: 'Pig face emoji.',
    context: 'Similar to the bacon emoji, used to harass Muslims by spamming pork-related imagery, which is considered impure in Islam.',
    severity: SeverityLevel.LOW,
    category: 'dog_whistles'
  },
  '💣': {
    term: '💣',
    meaning: 'Bomb emoji.',
    context: 'Routinely spammed on posts by Muslims to falsely equate their identity with terrorism.',
    severity: SeverityLevel.MEDIUM,
    category: 'dog_whistles'
  },
  'm*slim': {
    term: 'm*slim',
    meaning: 'Self-censoring the word Muslim.',
    context: 'Used by haters to avoid algorithmic detection and content moderation while engaging in hate speech.',
    severity: SeverityLevel.MEDIUM,
    category: 'dog_whistles'
  },
  'p*kistan': {
    term: 'p*kistan',
    meaning: 'Censoring Pakistan.',
    context: 'Used to avoid filters when spreading hate against Pakistanis or South Asian Muslims in general.',
    severity: SeverityLevel.MEDIUM,
    category: 'dog_whistles'
  },
  'religion of peace': {
    term: 'religion of peace',
    meaning: 'A phrase often used by Muslims and politicians to describe Islam.',
    context: 'Weaponized as a sarcastic meme to highlight acts of violence committed by extremists, implying that all Muslims are inherently violent.',
    severity: SeverityLevel.MEDIUM,
    category: 'dog_whistles'
  },

  // --- Political and Social Media Dog Whistles ---
  'grooming gangs': {
    term: 'grooming gangs',
    meaning: 'Refers to child sexual exploitation networks.',
    context: 'In the UK, far-right groups use this term as a dog whistle to vilify the entire British Pakistani/Muslim community, falsely implying pedophilia is an inherent Muslim trait.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'no-go zones': {
    term: 'no-go zones',
    meaning: 'Areas supposedly controlled by Sharia law where police fear to enter.',
    context: 'A debunked myth frequently spread by right-wing media in Europe and the US to paint Muslim-majority neighborhoods as dangerous and unassimilated.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'sharia law': {
    term: 'sharia law',
    meaning: 'Islamic canonical law based on the teachings of the Quran.',
    context: 'While a legitimate religious concept, it is frequently used as a scare word in Western politics to suggest an impending tyrannical takeover.',
    severity: SeverityLevel.MEDIUM,
    category: 'political_coded'
  },
  'stealth jihad': {
    term: 'stealth jihad',
    meaning: 'The idea that Muslims are quietly taking over institutions.',
    context: 'Used to block Muslims from holding public office, working in government, or opening businesses, claiming they are secret operatives.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'cultural marxism': {
    term: 'cultural marxism',
    meaning: 'An antisemitic conspiracy theory often linked with Islamophobia.',
    context: 'Claims that a cabal of leftists and Jewish elites are using Muslim immigration to destroy Western, Christian culture.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'invasion': {
    term: 'invasion',
    meaning: 'Describing immigration or refugee movements as a military invasion.',
    context: 'Dehumanizes migrants (often Muslim refugees from the Middle East/Africa) and portrays them as a literal military threat justifying violent self-defense.',
    severity: SeverityLevel.CRITICAL,
    category: 'political_coded'
  },
  'saracen': {
    term: 'saracen',
    meaning: 'An archaic term for Muslims from the Middle Ages/Crusades.',
    context: 'Revived by white supremacists and internet trolls to refer to Muslims in a historically adversarial, martial context.',
    severity: SeverityLevel.MEDIUM,
    category: 'dog_whistles'
  },

  'jizya': {
    term: 'jizya',
    meaning: 'A historical tax levied on non-Muslims.',
    context: 'Weaponized as a conspiracy theory to claim that purchasing Halal certified products funds terrorism ("economic jihad").',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'economic jihad': {
    term: 'economic jihad',
    meaning: 'The false claim that Muslims use economics to conquer.',
    context: 'A conspiracy theory used to justify boycotting Muslim businesses or Halal products.',
    severity: SeverityLevel.HIGH,
    category: 'conspiracy_terms'
  },
  'kebab': {
    term: 'kebab',
    meaning: 'Reference to the "Remove Kebab" meme.',
    context: 'An internet meme glorifying the ethnic cleansing of Bosnian Muslims by Serb forces in the 1990s.',
    severity: SeverityLevel.CRITICAL,
    category: 'coded_slurs'
  },

};
