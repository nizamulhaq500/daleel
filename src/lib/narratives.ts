export interface Narrative {
  id: number;
  claim: string;
  reality: string;
  category: string;
}

export const narratives: Narrative[] = [
  {
    id: 1,
    category: "Theology & Misrepresentation",
    claim: "Taqiyya allows and encourages Muslims to lie to non-Muslims to infiltrate Western society.",
    reality: "Fact: Taqiyya is a historically rare theological concept (primarily Shia) meant strictly to allow believers to conceal their faith ONLY to save their lives when facing extreme persecution or death. It is not a blank check to lie. Islam explicitly condemns deceit and commands honesty."
  },
  {
    id: 2,
    category: "Legal & Political",
    claim: "Muslims are secretly plotting to implement Sharia Law in Western countries.",
    reality: "Fact: 'Sharia' translates simply to 'the path' and refers to a broad personal moral code (how to pray, fast, give to charity). The vast majority of Muslims in the West actively support secular democracies. 'Creeping Sharia' is a conspiracy theory invented to pass unconstitutional bans."
  },
  {
    id: 3,
    category: "Society & Integration",
    claim: "There are 'No-Go Zones' in European and American cities where police refuse to enter and Sharia is enforced.",
    reality: "Fact: Numerous government officials, police departments, and independent fact-checkers across Europe and the US have repeatedly debunked this. While some cities have high-poverty immigrant neighborhoods, 'No-Go Zones' are a complete myth fabricated by far-right media."
  },
  {
    id: 4,
    category: "Demographics",
    claim: "The 'Great Replacement' or 'Eurabia'—Muslims are outbreeding natives to take over the West.",
    reality: "Fact: This is a white supremacist conspiracy theory. Data from the Pew Research Center shows that birth rates among Muslim immigrants drop rapidly to align with the national average of their host countries within a single generation."
  },
  {
    id: 5,
    category: "Economy",
    claim: "Halal certification is a secret 'Jizya' tax that funds Islamic terrorism.",
    reality: "Fact: Halal certification is a standard commercial service ensuring food meets Islamic dietary laws (like Kosher for Judaism). Global intelligence and charity commissions have investigated and found zero links between commercial Halal fees and terrorism financing."
  },
  {
    id: 6,
    category: "Violence & Extremism",
    claim: "Islam is inherently a religion of violence spread only by the sword.",
    reality: "Fact: Like all major religions, Islamic history contains periods of both conflict and coexistence. However, the Quran specifically states 'There is no compulsion in religion' (2:256). The largest Muslim populations today (Indonesia, Malaysia) adopted Islam through trade, not conquest."
  },
  {
    id: 7,
    category: "Violence & Extremism",
    claim: "Moderate Muslims never condemn acts of terrorism.",
    reality: "Fact: Muslim leaders, scholars, and organizations worldwide systematically and vocally condemn terrorism. This narrative persists simply because major media networks rarely broadcast these condemnations, placing an unfair burden of collective guilt on 1.9 billion people."
  },
  {
    id: 8,
    category: "Women's Rights",
    claim: "The Hijab is universally a symbol of female oppression and forced submission.",
    reality: "Fact: While forced veiling occurs in some authoritarian regimes (which is widely condemned), millions of Muslim women in the West and globally choose to wear the hijab as a symbol of personal faith, identity, and empowerment. Assuming all covered women are oppressed strips them of their agency."
  },
  {
    id: 9,
    category: "Conspiracy",
    claim: "Former President Barack Obama is a secret Muslim working to destroy America.",
    reality: "Fact: This was a deeply racist and Islamophobic political smear campaign. Obama is a practicing Christian. The underlying implication of the smear was that being a Muslim is inherently dangerous or un-American, which was used to stoke fear."
  },
  {
    id: 10,
    category: "Conspiracy",
    claim: "'Love Jihad' is a coordinated campaign by Muslim men to seduce and convert women of other faiths.",
    reality: "Fact: Originating in India, 'Love Jihad' is a debunked conspiracy theory used to pass discriminatory anti-conversion laws and incite mob violence. Investigations by state police agencies have repeatedly found no evidence of any coordinated campaign."
  },
  { id: 11, category: "Society", claim: "Muslims are trying to ban Christmas and pork in schools.", reality: "Fact: Fake news stories frequently claim Muslims petitioned to ban Christmas or pork. In reality, schools simply offer diverse dietary options (like vegetarian or halal), and Muslims revere Jesus as a major prophet and generally have no issue with Christmas." },
  { id: 12, category: "Theology", claim: "Muslims worship a 'Moon God', not the same God as Christians and Jews.", reality: "Fact: 'Allah' is simply the Arabic word for God, used by Arabic-speaking Christians and Jews as well. Islam is strictly monotheistic and worships the exact same God of Abraham." },
  { id: 13, category: "Extremism", claim: "The Quran commands Muslims to 'kill the infidels wherever you find them'.", reality: "Fact: This quote (the 'Sword Verse') is heavily cherry-picked. It refers specifically to a historical battle where a treaty was broken, and the very next verse says if the enemy seeks peace, you must grant it and protect them." },
  { id: 14, category: "Society", claim: "Muslim refugees are responsible for massive crime waves in Europe.", reality: "Fact: Comprehensive crime data from Germany and Sweden shows that crime rates among refugees are proportionate to or lower than the native population when adjusted for demographics (young men). Right-wing groups disproportionately amplify specific crimes to build this narrative." },
  { id: 15, category: "Culture", claim: "Islam is incompatible with democracy and Western values.", reality: "Fact: Millions of Muslims thrive in Western democracies. Countries like Indonesia, Senegal, and Tunisia demonstrate that Islamic societies can sustain democratic systems. 'Western values' and Islamic ethics heavily overlap in areas of justice, charity, and rule of law." },
  { id: 16, category: "Conspiracy", claim: "There are secret terrorist training camps embedded in rural America.", reality: "Fact: A fabricated myth pushed by fringe organizations. The FBI has repeatedly stated that there are no such camps. This trope is used to stoke paranoia against rural Muslim communities and communes." },
  { id: 17, category: "Theology", claim: "Jihad only means 'Holy War' and mandates violence against non-believers.", reality: "Fact: 'Jihad' translates to 'struggle.' The 'greater jihad' in Islamic theology is the internal, spiritual struggle to be a better person. While it can mean armed defense, the concept of aggressive 'holy war' is fundamentally counter to mainstream Islamic jurisprudence." },
  { id: 18, category: "Society", claim: "Muslim immigrants refuse to assimilate and want to live in parallel societies.", reality: "Fact: Studies consistently show Muslim immigrants assimilate at similar rates to past immigrant groups, learning the language, joining the workforce, and entering politics, while maintaining cultural heritage—the normal immigrant experience." },
  { id: 19, category: "Culture", claim: "All grooming gangs in the UK are composed of Muslim men targeting white girls.", reality: "Fact: UK Home Office research concluded that group-based child sexual exploitation is predominantly committed by white men. The media hyper-fixated on specific cases involving South Asian men, falsely framing it as an 'Islamic' or 'Muslim' issue." },
  { id: 20, category: "Theology", claim: "Muslims hate dogs and want them banned from public spaces.", reality: "Fact: While some interpretations of Islamic jurisprudence consider dog saliva impure (requiring washing before prayer), many Muslims own dogs for protection, herding, or companionship. There is no Islamic mandate to ban dogs from society." },
  { id: 21, category: "Society", claim: "Muslims are anti-Semitic by religious mandate.", reality: "Fact: Muslims and Jews lived in relative harmony in the Islamic world for centuries (e.g., Al-Andalus) when Europe was deeply anti-Semitic. Modern tensions are largely rooted in 20th-century geopolitical conflicts, not inherent religious doctrine." },
  { id: 22, category: "Legal", claim: "Sharia courts in the UK are replacing British law.", reality: "Fact: So-called 'Sharia courts' are simply voluntary arbitration tribunals for civil matters (like divorce or financial disputes), similar to Jewish Beth Din courts. They have no criminal jurisdiction and are entirely subordinate to UK law." },
  { id: 23, category: "Culture", claim: "Islam oppresses women by denying them education and rights.", reality: "Fact: The Quran guarantees women the right to own property, inherit, and seek education (radical for the 7th century). Oppression in places like Afghanistan under the Taliban is a result of extremist patriarchal tribalism, broadly condemned by mainstream Islamic scholars." },
  { id: 24, category: "Conspiracy", claim: "Muslim politicians (like Ilhan Omar or Sadiq Khan) are acting as Trojan horses to destroy the West from within.", reality: "Fact: This is a textbook dual-loyalty trope. These politicians are democratically elected officials serving their constituents. Smearing them as 'infiltrators' is a tactic to disenfranchise Muslim political participation." },
  { id: 25, category: "Theology", claim: "72 virgins are promised to terrorists who die in jihad.", reality: "Fact: The concept of '72 virgins' comes from a weak (da'if) and heavily disputed Hadith, not the Quran. Extremist groups weaponize this weak tradition for recruitment, while mainstream scholars reject its literal, hyper-sexualized interpretation." },
  { id: 26, category: "Demographics", claim: "London has become 'Londonistan' due to Muslim overpopulation.", reality: "Fact: London is a highly diverse global city. Muslims make up roughly 15% of London's population. Calling it 'Londonistan' is a derogatory dog-whistle intended to frame diversity as an invasion." },
  { id: 27, category: "Legal", claim: "Muslims demand special privileges in the workplace.", reality: "Fact: Requesting basic religious accommodations—such as a space to pray or adjusted hours for fasting—is a standard civil right protected by law for all religions, not a 'special privilege'." },
  { id: 28, category: "Culture", claim: "Muslims do not contribute to Western society or innovation.", reality: "Fact: Muslims are deeply embedded in Western medicine, tech, engineering, and arts. Furthermore, historical Islamic Golden Age scholars laid the foundational mathematics and sciences that triggered the European Renaissance." },
  { id: 29, category: "Conspiracy", claim: "The UN Migration Pact is a secret plot to flood Europe with Muslim migrants.", reality: "Fact: The UN Global Compact for Migration is a non-binding framework to ensure safe and orderly migration. Far-right influencers fabricated the narrative that it forces countries to accept unlimited Muslim refugees." },
  { id: 30, category: "Theology", claim: "Islam is a totalitarian political ideology, not a religion.", reality: "Fact: This redefinition is a deliberate legal strategy used by anti-Muslim hate groups. By stripping Islam of its status as a religion, they attempt to strip Muslims of their constitutional First Amendment protections regarding freedom of religion." },
  { id: 31, category: "Violence", claim: "All terrorists are Muslims.", reality: "Fact: Global terrorism datasets show a wide variety of perpetrators, including white supremacists, ethno-nationalists, and left-wing extremists. In the US, domestic right-wing extremists account for the vast majority of terrorist incidents." },
  { id: 32, category: "Society", claim: "Muslims celebrate when terrorist attacks happen in the West.", reality: "Fact: Following events like 9/11, urban legends spread about 'dancing Muslims.' These claims were investigated and debunked by police and journalists. Muslim communities mourn these tragedies alongside their neighbors." },
  { id: 33, category: "Theology", claim: "The Prophet Muhammad was a pedophile.", reality: "Fact: This attack relies on projecting modern age-of-consent laws onto 7th-century norms, where marriage occurred post-puberty. The historical age of Aisha is also debated among scholars. This trope is solely used to outrage and dehumanize." },
  { id: 34, category: "Culture", claim: "Muslim immigrants drain the welfare system.", reality: "Fact: Economic studies in the US and Europe consistently show that immigrants, including Muslims, are net contributors to the economy, paying more in taxes over their lifetimes than they take in benefits." },
  { id: 35, category: "Theology", claim: "Islam forces conversions under the threat of death.", reality: "Fact: Forced conversion is explicitly prohibited in Islamic law. While historical anomalies and modern extremist groups (like ISIS) have violated this rule, normative Islam forbids coercion in faith." },
  { id: 36, category: "Conspiracy", claim: "Muslims control the media to hide their crimes.", reality: "Fact: A recycling of classic anti-Semitic tropes. In reality, media coverage of Muslims is overwhelmingly negative; studies show terrorist attacks committed by Muslims receive over 350% more media coverage than attacks by non-Muslims." },
  { id: 37, category: "Society", claim: "Mosques are hotbeds for radicalization and weapons storage.", reality: "Fact: Mosques are community centers, places of worship, and food banks. Undercover law enforcement operations have consistently found that extremist radicalization happens predominantly online in isolated chat rooms, not in community mosques." },
  { id: 38, category: "Culture", claim: "Honor killings are an Islamic practice.", reality: "Fact: Honor killings are a cultural, tribal phenomenon tied to toxic patriarchy in specific regions across the world. They occur among Hindus, Christians, and Muslims in those regions, and are strictly classified as murder under Islamic law." },
  { id: 39, category: "Violence", claim: "Islam is the only religion that has sectarian violence.", reality: "Fact: Sectarian violence (e.g., Sunni vs. Shia) is driven by modern geopolitical proxy wars (like Saudi Arabia vs. Iran), much like the Catholic-Protestant violence during the Thirty Years' War or the Irish Troubles." },
  { id: 40, category: "Society", claim: "Muslims are responsible for the spread of diseases via immigration.", reality: "Fact: This xenophobic trope has been used against every wave of immigrants in history. Public health data shows no correlation between Muslim immigration and disease outbreaks." },
  { id: 41, category: "Conspiracy", claim: "Muslims are stockpiling weapons in major cities.", reality: "Fact: Urban legends frequently circulate claiming police found massive weapons caches in mosques. These are repeatedly debunked as fake news designed to incite preemptive violence against Muslim communities." },
  { id: 42, category: "Culture", claim: "Muslims hate free speech and want to destroy the First Amendment.", reality: "Fact: While many Muslims protest the derogatory mocking of their Prophet (just as other groups protest desecration of their sacred symbols), they rely heavily on and advocate for First Amendment protections to practice their minority faith safely." },
  { id: 43, category: "Demographics", claim: "Islam will become the majority religion in the US by 2050.", reality: "Fact: Pew Research projects that Muslims will make up roughly 2.1% of the US population by 2050. The fearmongering of a 'Muslim takeover' is statistically absurd." },
  { id: 44, category: "Theology", claim: "Islam teaches that non-Muslims are subhuman.", reality: "Fact: The Quran acknowledges the shared humanity of all people, explicitly honoring Christians and Jews as 'People of the Book' and promoting justice and equity for people of all faiths." },
  { id: 45, category: "Society", claim: "Muslims want to ban alcohol globally.", reality: "Fact: While practicing Muslims abstain from alcohol, there is no organized movement by Muslims in the West to enact prohibition laws on non-Muslims." },
  { id: 46, category: "Culture", claim: "Female Genital Mutilation (FGM) is an Islamic mandate.", reality: "Fact: FGM is a pre-Islamic cultural practice concentrated in specific parts of Africa. It is practiced by Christians, Animists, and Muslims in those regions. Global Islamic authorities have issued fatwas declaring it un-Islamic." },
  { id: 47, category: "Conspiracy", claim: "Muslims are secretly funding left-wing political movements to destabilize governments.", reality: "Fact: This conspiracy merges anti-Muslim bias with political paranoia. Muslim political donations are transparent, heavily scrutinized, and span the political spectrum based on civic interests." },
  { id: 48, category: "Legal", claim: "Polygamy is rampant among Muslims in the West.", reality: "Fact: Polygamy is illegal in Western countries, and the overwhelming majority of Muslims globally practice monogamy. The trope is used to depict Muslims as culturally backwards and threatening to family structures." },
  { id: 49, category: "Violence", claim: "Palestinian protests are just fronts for anti-Semitic terrorism.", reality: "Fact: While instances of anti-Semitism at protests are widely condemned, the core of the protests is rooted in human rights, anti-war sentiment, and political self-determination, not religious hatred." },
  { id: 50, category: "Society", claim: "You cannot be a true Muslim and a loyal citizen of a Western country.", reality: "Fact: This is the ultimate goal of Islamophobic rhetoric: to enforce alienation. Millions of Muslims serve in Western militaries, governments, and civil services, viewing their civic duty and faith as perfectly complementary." }
];
