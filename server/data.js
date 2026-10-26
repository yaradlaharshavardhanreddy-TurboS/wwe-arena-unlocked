// All arenas, costs, rewards and trivia live here.
// Each arena has 3 questions. Players pay `cost` to enter, need PASS_MARK correct to unlock.
export const PASS_MARK = 2
export const DAILY_BONUS = 20
export const STARTER_PROGRESS = { tokens: 50, unlocked: [], players: [], streak: 0, bonusDay: '' }

export const ARENAS = [
  { id: 1, name: 'WrestleMania III', era: 'Golden Era', icon: '🏟️', cost: 10, reward: 30, questions: [
    { q: 'Which giant did Hulk Hogan bodyslam at WrestleMania III?', options: ['Big John Studd', 'Andre the Giant', 'King Kong Bundy', 'Paul Orndorff'], correct: 1 },
    { q: 'Which stadium hosted WrestleMania III?', options: ['Pontiac Silverdome', 'Madison Square Garden', 'Louisiana Superdome', 'Rose Bowl'], correct: 0 },
    { q: 'Who won the Intercontinental Championship from Randy Savage at WrestleMania III?', options: ['Greg Valentine', 'Ricky Steamboat', 'Rick Rude', 'Jake Roberts'], correct: 1 },
  ] },
  { id: 2, name: 'WCW Nitro 1996', era: 'Monday Night Wars', icon: '💥', cost: 15, reward: 40, questions: [
    { q: 'Which faction did Hulk Hogan, Scott Hall and Kevin Nash form in WCW?', options: ['D-Generation X', 'The nWo', 'The Four Horsemen', 'Evolution'], correct: 1 },
    { q: 'Who revealed himself as the nWo\'s third member at Bash at the Beach 1996?', options: ['Sting', 'Lex Luger', 'Hulk Hogan', 'Randy Savage'], correct: 2 },
    { q: 'Which US network aired WCW Monday Nitro?', options: ['TBS', 'TNT', 'USA Network', 'ESPN'], correct: 1 },
  ] },
  { id: 3, name: 'WrestleMania X-Seven', era: 'Attitude Era', icon: '🔥', cost: 15, reward: 45, questions: [
    { q: 'Who did The Rock face in the main event of WrestleMania X-Seven?', options: ['Triple H', 'Stone Cold Steve Austin', 'The Undertaker', 'Kurt Angle'], correct: 1 },
    { q: 'Who helped Stone Cold win the title at WrestleMania X-Seven?', options: ['Triple H', 'Shane McMahon', 'Vince McMahon', 'Kurt Angle'], correct: 2 },
    { q: 'Which stadium hosted WrestleMania X-Seven?', options: ['SkyDome', 'Georgia Dome', 'Houston Astrodome', 'Superdome'], correct: 2 },
  ] },
  { id: 4, name: 'Vengeance 2001', era: 'Attitude Era', icon: '🏆', cost: 20, reward: 50, questions: [
    { q: 'Who became the first Undisputed WWF Champion at Vengeance 2001?', options: ['Chris Jericho', 'The Rock', 'Kurt Angle', 'Booker T'], correct: 0 },
    { q: 'Which two champions did Chris Jericho beat on the same night at Vengeance 2001?', options: ['Triple H and Kurt Angle', 'The Undertaker and Kane', 'The Rock and Stone Cold Steve Austin', 'Booker T and Edge'], correct: 2 },
    { q: 'What was the 2001 WWF vs WCW/ECW storyline called?', options: ['The Invasion', 'The Ministry', 'The Authority', 'The Nexus'], correct: 0 },
  ] },
  { id: 5, name: 'SummerSlam 1992', era: 'Golden Era', icon: '☀️', cost: 10, reward: 25, questions: [
    { q: 'Which stadium hosted SummerSlam 1992?', options: ['Madison Square Garden', 'Wembley Stadium', 'SkyDome', 'Astrodome'], correct: 1 },
    { q: 'Who did Bret Hart face for the Intercontinental Championship at SummerSlam 1992?', options: ['Shawn Michaels', 'Mr. Perfect', 'The British Bulldog', 'Ric Flair'], correct: 2 },
    { q: 'In which city is Wembley Stadium?', options: ['Manchester', 'London', 'Glasgow', 'Birmingham'], correct: 1 },
  ] },
  { id: 6, name: 'ECW One Night Stand 2006', era: 'Extreme Revolution', icon: '🩸', cost: 20, reward: 60, questions: [
    { q: 'Who beat John Cena for the WWE Championship at One Night Stand 2006?', options: ['Sabu', 'Rob Van Dam', 'Tommy Dreamer', 'The Sandman'], correct: 1 },
    { q: 'Which venue hosted ECW One Night Stand 2006?', options: ['Madison Square Garden', 'ECW Arena', 'Hammerstein Ballroom', 'Nassau Coliseum'], correct: 2 },
    { q: 'In which city was the original ECW Arena?', options: ['Boston', 'New York', 'Chicago', 'Philadelphia'], correct: 3 },
  ] },
]

// Superstars players can buy with tokens.
// Cost follows tier: Rising 30-45, Main Event 50-70, Icon 80-100 (career impact and championship legacy).
// Portrait: drop your own image at public/players/<file>; if it is missing, a monogram shows instead.
export const PLAYERS = [
  { id: 'rey', name: 'Rey Mysterio', initials: 'RM', color: '#2f9bd8', tier: 'Rising', style: 'High-flyer', cost: 30, move: '619',
    image: '/players/rey-mysterio.jpg',
    bio: 'Masked high-flyer who proved speed and daring can beat size. Famous for the 619 and a career that spans WCW and WWE.' },
  { id: 'bige', name: 'Big E', initials: 'BE', color: '#e8a21a', tier: 'Rising', style: 'Powerhouse', cost: 30, move: 'Big Ending',
    image: '/players/big-e.jpg',
    bio: 'The strength and booming voice of The New Day. A former WWE Champion and Intercontinental Champion with huge energy.' },
  { id: 'seth', name: 'Seth Rollins', initials: 'SR', color: '#c8322d', tier: 'Rising', style: 'Athlete', cost: 45, move: 'The Stomp',
    image: '/players/seth-rollins.jpg',
    bio: 'Founding member of The Shield who cashed in Money in the Bank at WrestleMania 31. Fast, athletic and endlessly confident.' },
  { id: 'orton', name: 'Randy Orton', initials: 'RO', color: '#4aa36a', tier: 'Main Event', style: 'Predator', cost: 50, move: 'RKO',
    image: '/players/randy-orton.jpg',
    bio: 'The Viper, a third-generation star who became the youngest world heavyweight champion of his time in 2004. Strikes out of nowhere.' },
  { id: 'roman', name: 'Roman Reigns', initials: 'RR', color: '#3b5bdb', tier: 'Main Event', style: 'Powerhouse', cost: 60, move: 'Spear',
    image: '/players/roman-reigns.jpg',
    bio: 'Samoan powerhouse from The Shield who rose to lead The Bloodline as the Tribal Chief. Held the Universal Championship for over three years.' },
  { id: 'brock', name: 'Brock Lesnar', initials: 'BL', color: '#7a7f8c', tier: 'Main Event', style: 'Powerhouse', cost: 60, move: 'F-5',
    image: '/players/brock-lesnar.jpg',
    bio: 'Former NCAA heavyweight champion and UFC Heavyweight Champion who ended The Undertaker\'s WrestleMania streak at WrestleMania 30.' },
  { id: 'hbk', name: 'Shawn Michaels', initials: 'SM', color: '#d94fa0', tier: 'Main Event', style: 'Showman', cost: 70, move: 'Sweet Chin Music',
    image: '/players/shawn-michaels.jpg',
    bio: 'The Heartbreak Kid and Mr. WrestleMania, known for show-stealing matches like the WrestleMania X ladder match.' },
  { id: 'hhh', name: 'Triple H', initials: 'HHH', color: '#8d6bd8', tier: 'Main Event', style: 'Strategist', cost: 70, move: 'Pedigree',
    image: '/players/triple-h.jpg',
    bio: 'The Game, co-founder of D-Generation X and a longtime world champion who later helped build NXT. Calculated and ruthless.' },
  { id: 'cena', name: 'John Cena', initials: 'JC', color: '#2e9e5b', tier: 'Icon', style: 'Franchise', cost: 80, move: 'Attitude Adjustment',
    image: '/players/john-cena.jpg',
    bio: 'The face of WWE through the 2000s and 2010s, built on Never Give Up. One of its most decorated champions and a movie star outside the ring.' },
  { id: 'austin', name: 'Stone Cold Steve Austin', initials: 'SCSA', color: '#b5651d', tier: 'Icon', style: 'Brawler', cost: 90, move: 'Stone Cold Stunner',
    image: '/players/stone-cold.jpg',
    bio: 'The Texas Rattlesnake, the anti-authority hero whose rivalry with Mr. McMahon defined the Attitude Era.' },
  { id: 'taker', name: 'The Undertaker', initials: 'UT', color: '#5b4b8a', tier: 'Icon', style: 'Phenom', cost: 90, move: 'Tombstone Piledriver',
    image: '/players/undertaker.jpg',
    bio: 'The Deadman, a three-decade career built on mystery and a WrestleMania streak that reached 21-0 before ending at WrestleMania 30.' },
  { id: 'rock', name: 'The Rock', initials: 'TR', color: '#d4a017', tier: 'Icon', style: 'Showman', cost: 100, move: 'Rock Bottom',
    image: '/players/the-rock.jpg',
    bio: 'Third-generation star and People\'s Champion, the Attitude Era\'s biggest crossover act and now a Hollywood leading man. Famous for the People\'s Elbow.' },
]

export const QUESTION_SECONDS = 15
export const ANSWER_GRACE_SECONDS = 5 // network + reveal delay allowance

// What the browser may see: no correct answers, and questions only arrive when a challenge starts.
export const publicCatalog = () => ({
  passMark: PASS_MARK,
  dailyBonus: DAILY_BONUS,
  questionSeconds: QUESTION_SECONDS,
  arenas: ARENAS.map(({ questions, ...a }) => ({ ...a, questionCount: questions.length })),
  players: PLAYERS,
})
