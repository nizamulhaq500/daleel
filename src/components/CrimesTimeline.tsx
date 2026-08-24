import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Crime {
  id: string;
  headline: string;
  date: string;
  location: string;
  image: string;
  brief: string;
  fullStory: string;
}

const crimes: Crime[] = [
  {
    id: "christchurch",
    headline: "Christchurch Mosque Shootings",
    date: "March 15, 2019",
    location: "Christchurch, New Zealand",
    image: "/crimes/christchurch.jpg",
    brief: "51 people killed in coordinated terrorist attacks on two mosques.",
    fullStory: "A white supremacist terrorist attacked the Al Noor Mosque and the Linwood Islamic Centre during Friday prayer, killing 51 people and injuring 40. The attacker published a manifesto echoing the 'Great Replacement' conspiracy theory and live-streamed the attack, demonstrating how online radicalization and Islamophobic tropes translate directly into mass violence."
  },
  {
    id: "quebec",
    headline: "Quebec City Mosque Attack",
    date: "January 29, 2017",
    location: "Quebec City, Canada",
    image: "/crimes/quebec.jpg",
    brief: "6 worshipers killed and 8 injured at the Islamic Cultural Centre.",
    fullStory: "A lone gunman entered the Islamic Cultural Centre of Quebec City after evening prayers and opened fire, killing six worshipers and injuring eight others. The shooter was heavily influenced by far-right, anti-Muslim commentators online and was radicalized by false narratives regarding Muslim refugees."
  },
  {
    id: "finsbury",
    headline: "Finsbury Park Attack",
    date: "June 19, 2017",
    location: "London, UK",
    image: "/crimes/finsbury.jpg",
    brief: "A man drove a van into pedestrians leaving Taraweeh prayers, killing 1.",
    fullStory: "Darren Osborne drove a rented van into a crowd of Muslims leaving the Muslim Welfare House after Taraweeh prayers during Ramadan. One person was killed and 10 others injured. Investigations revealed Osborne had rapidly radicalized in the weeks prior by consuming far-right, anti-Muslim propaganda online."
  },
  {
    id: "london-ontario",
    headline: "London, Ontario Truck Attack",
    date: "June 6, 2021",
    location: "London, Ontario, Canada",
    image: "/crimes/london-ontario.jpg",
    brief: "A family of 4 was killed when a man intentionally drove his truck into them.",
    fullStory: "Four members of the Afzaal family were killed and a 9-year-old boy was severely injured when a man intentionally drove his pickup truck into them while they were waiting to cross the street. Canadian police and prosecutors designated it a premeditated terrorist attack motivated by anti-Muslim hate."
  },
  {
    id: "chapel-hill",
    headline: "Chapel Hill Shootings",
    date: "February 10, 2015",
    location: "Chapel Hill, North Carolina, USA",
    image: "/crimes/chapel-hill.jpg",
    brief: "Three young Muslim students were murdered in their home.",
    fullStory: "Deah Shaddy Barakat, Yusor Mohammad Abu-Salha, and Razan Mohammad Abu-Salha were murdered in their apartment by a neighbor. While initially dismissed by some as a parking dispute, the perpetrator had a history of making anti-religious statements, and the families and civil rights groups classify it as a hate crime."
  },
  {
    id: "hanau",
    headline: "Hanau Shootings",
    date: "February 19, 2020",
    location: "Hanau, Germany",
    image: "/crimes/hanau.jpg",
    brief: "9 people of immigrant background killed by a far-right extremist.",
    fullStory: "A far-right extremist attacked two shisha bars in Hanau, killing nine people, many of whom were of Turkish or Kurdish Muslim descent. The attacker left behind a manifesto detailing deeply racist and anti-Muslim conspiracy theories before killing his mother and himself."
  },
  {
    id: "oslo-mosque",
    headline: "Al-Noor Islamic Centre Attack",
    date: "August 10, 2019",
    location: "Bærum, Norway",
    image: "/crimes/oslo-mosque.jpg",
    brief: "A heavily armed neo-Nazi opened fire inside a mosque.",
    fullStory: "Philip Manshaus entered the Al-Noor Islamic Centre armed with multiple weapons and opened fire. A 65-year-old worshiper overpowered him, preventing mass casualties. Manshaus stated he was inspired by the Christchurch attacks, demonstrating the contagious nature of online Islamophobia."
  },
  {
    id: "wadea",
    headline: "Murder of Wadea Al-Fayoume",
    date: "October 14, 2023",
    location: "Plainfield, Illinois, USA",
    image: "/crimes/wadea.jpg",
    brief: "A 6-year-old Palestinian-American boy was stabbed 26 times by his landlord.",
    fullStory: "Six-year-old Wadea Al-Fayoume was murdered and his mother severely injured when their landlord attacked them with a knife. Prosecutors stated the attacker was heavily influenced by conservative talk radio and rising anti-Muslim/anti-Palestinian rhetoric surrounding international conflicts."
  },
  {
    id: "rohingya",
    headline: "Rohingya Genocide",
    date: "2016 - Present",
    location: "Rakhine State, Myanmar",
    image: "/crimes/rohingya.jpg",
    brief: "State-sponsored ethnic cleansing of the Muslim minority.",
    fullStory: "The Myanmar military launched a brutal crackdown on the Rohingya Muslim minority, resulting in thousands of deaths, mass rapes, and the burning of villages. UN officials noted that hate speech and anti-Muslim propaganda spread rapidly on platforms like Facebook, directly fueling the violence."
  },
  {
    id: "portland",
    headline: "Portland Train Attack",
    date: "May 26, 2017",
    location: "Portland, Oregon, USA",
    image: "/crimes/portland.jpg",
    brief: "2 men killed defending Muslim teenagers from racist harassment.",
    fullStory: "A known white supremacist began aggressively shouting anti-Muslim slurs at two teenage girls (one wearing a hijab) on a train. When three bystanders intervened to protect the girls, the attacker stabbed them, killing two. The event highlighted the daily harassment faced by visibly Muslim women."
  }
];

export default function CrimesTimeline() {
  const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null);
  const [acceptedWarning, setAcceptedWarning] = useState(false);

  return (
    <div className="w-full mt-16 pb-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          The Real-World Cost of Islamophobia
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg">
          Disinformation is not victimless. When anti-Muslim tropes and conspiracies are allowed to spread unchecked online, they radicalize individuals and lead directly to real-world violence.
        </p>
      </div>

      {!acceptedWarning ? (
        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-8 max-w-3xl mx-auto text-center backdrop-blur-sm">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Content Warning</h3>
          <p className="text-slate-300 mb-6">
            The following section documents real-world hate crimes, mass shootings, and violence against Muslims. 
            These descriptions and images may be distressing or re-traumatizing.
          </p>
          <button 
            onClick={() => setAcceptedWarning(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-red-900/20"
          >
            I Understand, Show Content
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {crimes.map((crime) => (
          <div 
            key={crime.id}
            onClick={() => setSelectedCrime(crime)}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all group"
          >
            <div className="h-40 w-full overflow-hidden bg-slate-800 relative">
              {/* Fallback pattern if image fails */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <img 
                src={crime.image} 
                alt={crime.headline} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <div className="p-5">
              <div className="text-xs text-red-400 font-semibold mb-2">{crime.date} • {crime.location}</div>
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">{crime.headline}</h3>
              <p className="text-slate-400 text-sm line-clamp-3">{crime.brief}</p>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Modal */}
      {selectedCrime && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-800 z-10">
              <h3 className="text-xl font-bold text-white">Tragedy Timeline</h3>
              <button 
                onClick={() => setSelectedCrime(null)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-6 bg-slate-800 relative">
                <img 
                  src={selectedCrime.image} 
                  alt={selectedCrime.headline}
                  className="w-full h-full object-cover" 
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full border border-red-500/30">
                  {selectedCrime.date}
                </span>
                <span className="text-slate-400 font-medium">
                  {selectedCrime.location}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-6">{selectedCrime.headline}</h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-lg leading-relaxed">
                  {selectedCrime.fullStory}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
