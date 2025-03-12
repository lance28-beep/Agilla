import { Question, EventCard } from '../types/game';

export const questions: Question[] = [
  // Opportunity Cost Questions - Easy (10 points)
  {
    id: 1,
    category: "Opportunity Cost",
    text: "What is opportunity cost?",
    options: [
      "The actual cost of a product",
      "The next best alternative given up when making a choice",
      "The total cost of all options",
      "The market price of a good"
    ],
    correctAnswer: "The next best alternative given up when making a choice",
    explanation: "Opportunity cost is what you give up to get something else. It's the value of the next best alternative.",
    difficulty: "easy",
    points: 10
  },
  {
    id: 2,
    category: "Opportunity Cost",
    text: "If you choose to study instead of watching a movie, what's your opportunity cost?",
    options: [
      "The time spent studying",
      "The enjoyment of watching the movie",
      "The cost of the movie ticket",
      "The knowledge gained from studying"
    ],
    correctAnswer: "The enjoyment of watching the movie",
    explanation: "The opportunity cost is the enjoyment you gave up by not watching the movie.",
    difficulty: "easy",
    points: 10
  },
  // Opportunity Cost Questions - Medium (20 points)
  {
    id: 3,
    category: "Opportunity Cost",
    text: "A farmer can plant either corn or soybeans. If corn generates $5000 profit and soybeans $4000, what's the opportunity cost of planting corn?",
    options: [
      "$5000 from corn",
      "$4000 from soybeans",
      "$9000 total possible profit",
      "No opportunity cost"
    ],
    correctAnswer: "$4000 from soybeans",
    explanation: "By choosing to plant corn, the farmer gives up $4000 profit from soybeans.",
    difficulty: "medium",
    points: 20
  },
  // Trade-off Questions - Hard (30 points)
  {
    id: 4,
    category: "Trade-off",
    text: "In economics, what is the classic 'guns vs butter' model used to illustrate?",
    options: [
      "Military spending preferences",
      "Consumer choices",
      "The production possibilities frontier and opportunity cost",
      "Government budgeting"
    ],
    correctAnswer: "The production possibilities frontier and opportunity cost",
    explanation: "This model shows how a society must choose between two goods, demonstrating scarcity and opportunity cost.",
    difficulty: "hard",
    points: 30
  },
  // Marginal Thinking Questions - Expert (50 points)
  {
    id: 5,
    category: "Marginal Thinking",
    text: "How does marginal analysis help in making economic decisions?",
    options: [
      "By considering total costs and benefits",
      "By comparing additional costs with additional benefits",
      "By analyzing past decisions",
      "By predicting future market trends"
    ],
    correctAnswer: "By comparing additional costs with additional benefits",
    explanation: "Marginal analysis looks at the additional benefits and costs of an action, helping make optimal decisions.",
    difficulty: "expert",
    points: 50
  },
  {
    id: 6,
    category: "Opportunity Cost",
    text: "Pinili ni Ana na mag-aral kaysa manood ng sine. Ano ang opportunity cost sa kanyang desisyon?",
    options: [
      "Oras na ginugol sa pag-aaral",
      "Pera para sa sine",
      "Kasiyahan sa panonood ng sine",
      "Gastos sa pagkain"
    ],
    correctAnswer: "Kasiyahan sa panonood ng sine",
    explanation: "The opportunity cost is the enjoyment foregone from not watching the movie.",
    difficulty: "easy",
    points: 10
  },
  {
    id: 7,
    category: "Opportunity Cost",
    text: "Ang isang magsasaka ay nagdesisyon na magtanim ng palay sa halip na mais. Ano ang opportunity cost?",
    options: [
      "Kita sa pagtatanim ng palay",
      "Gastos sa pagbili ng binhi",
      "Kita mula sa mais",
      "Oras ng pagtatanim"
    ],
    correctAnswer: "Kita mula sa mais",
    explanation: "The opportunity cost is the potential income from corn that was given up.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 8,
    category: "Opportunity Cost",
    text: "Ang pagpili ng kurso sa kolehiyo ay isang halimbawa ng:",
    options: [
      "Trade-off",
      "Scarcity",
      "Opportunity Cost",
      "Incentives"
    ],
    correctAnswer: "Opportunity Cost",
    explanation: "Choosing a college course means giving up other potential courses you could have taken.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 9,
    category: "Opportunity Cost",
    text: "Kapag naglaan ng oras sa paglalaro imbis na mag-aral, ang opportunity cost ay:",
    options: [
      "Kasiyahan sa paglalaro",
      "Marka sa pagsusulit",
      "Pera sa internet",
      "Oras sa pamilya"
    ],
    correctAnswer: "Marka sa pagsusulit",
    explanation: "The opportunity cost is the potential better grades you could have earned by studying.",
    difficulty: "easy",
    points: 10
  },
  {
    id: 10,
    category: "Trade-off",
    text: "Ang pagtanggap ng mas mababang sweldo kapalit ng mas maikling oras ng trabaho ay halimbawa ng:",
    options: [
      "Trade-off",
      "Scarcity",
      "Opportunity Cost",
      "Incentives"
    ],
    correctAnswer: "Trade-off",
    explanation: "This is a trade-off between higher income and more free time.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 11,
    category: "Trade-off",
    text: "Kapag pinili mong bumili ng cellphone imbis na damit, ano ang trade-off?",
    options: [
      "Oras sa pag-aaral",
      "Pera para sa damit",
      "Pera para sa pagkain",
      "Oras sa paglalaro"
    ],
    correctAnswer: "Pera para sa damit",
    explanation: "The trade-off is the money that could have been spent on clothes.",
    difficulty: "easy",
    points: 10
  },
  {
    id: 12,
    category: "Trade-off",
    text: "Ang desisyong mag-ipon kaysa gumastos ay isang halimbawa ng:",
    options: [
      "Trade-off",
      "Marginal Thinking",
      "Opportunity Cost",
      "Incentives"
    ],
    correctAnswer: "Trade-off",
    explanation: "This represents a trade-off between current consumption and future savings.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 13,
    category: "Trade-off",
    text: "Sa paggawa ng desisyon, ang pagtalikod sa isang pagpipilian ay tinatawag na:",
    options: [
      "Incentives",
      "Scarcity",
      "Trade-off",
      "Marginal Thinking"
    ],
    correctAnswer: "Trade-off",
    explanation: "A trade-off occurs when you give up one option to choose another.",
    difficulty: "hard",
    points: 30
  },
  {
    id: 14,
    category: "Marginal Thinking",
    text: "Ang pagsusuri kung sulit bang bumili ng dagdag na pizza ay halimbawa ng:",
    options: [
      "Trade-off",
      "Marginal Thinking",
      "Opportunity Cost",
      "Incentives"
    ],
    correctAnswer: "Marginal Thinking",
    explanation: "Analyzing whether an additional pizza is worth it is an example of marginal thinking.",
    difficulty: "hard",
    points: 30
  },
  {
    id: 15,
    category: "Marginal Thinking",
    text: "Kapag iniisip kung sulit ang karagdagang gastos para sa premium subscription, ito ay:",
    options: [
      "Trade-off",
      "Marginal Thinking",
      "Opportunity Cost",
      "Incentives"
    ],
    correctAnswer: "Marginal Thinking",
    explanation: "Evaluating if the extra cost is worth the additional benefits is marginal thinking.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 16,
    category: "Marginal Thinking",
    text: "Ang pagsusuri kung sulit bang mag-overtime ay halimbawa ng:",
    options: [
      "Trade-off",
      "Marginal Thinking",
      "Opportunity Cost",
      "Scarcity"
    ],
    correctAnswer: "Marginal Thinking",
    explanation: "Analyzing if extra work hours are worth the additional pay is marginal thinking.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 17,
    category: "Incentives",
    text: "Ang pagtanggap ng dagdag na sahod para sa overtime ay isang halimbawa ng:",
    options: [
      "Opportunity Cost",
      "Trade-off",
      "Incentives",
      "Scarcity"
    ],
    correctAnswer: "Incentives",
    explanation: "Extra pay for overtime work is an incentive to work more hours.",
    difficulty: "easy",
    points: 10
  },
  {
    id: 18,
    category: "Incentives",
    text: "Kapag nagbigay ang gobyerno ng diskwento sa buwis para sa mga negosyante, ito ay:",
    options: [
      "Opportunity Cost",
      "Trade-off",
      "Incentives",
      "Scarcity"
    ],
    correctAnswer: "Incentives",
    explanation: "Tax discounts are incentives to encourage business activity.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 19,
    category: "Incentives",
    text: "Ang pagbibigay ng bonus para sa maagang pagbabayad ng utang ay:",
    options: [
      "Trade-off",
      "Incentives",
      "Scarcity",
      "Opportunity Cost"
    ],
    correctAnswer: "Incentives",
    explanation: "A bonus for early payment is an incentive to pay debts promptly.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 20,
    category: "Incentives",
    text: "Ang mga pagpipilian sa paggawa ng desisyon ay may magandang dulot. Ano ito?",
    options: [
      "Marginal Thinking",
      "Trade-off",
      "Opportunity Cost",
      "Incentives"
    ],
    correctAnswer: "Incentives",
    explanation: "Incentives are positive outcomes that influence decision-making.",
    difficulty: "hard",
    points: 30
  },
  {
    id: 21,
    category: "Scarcity",
    text: "Ang limitadong suplay ng bigas sa merkado ay isang halimbawa ng:",
    options: [
      "Trade-off",
      "Incentives",
      "Scarcity",
      "Opportunity Cost"
    ],
    correctAnswer: "Scarcity",
    explanation: "Limited rice supply in the market demonstrates scarcity of resources.",
    difficulty: "easy",
    points: 10
  },
  {
    id: 22,
    category: "Scarcity",
    text: "Kapag maraming nagnanais ngunit kakaunti ang suplay, ito ay:",
    options: [
      "Trade-off",
      "Scarcity",
      "Opportunity Cost",
      "Incentives"
    ],
    correctAnswer: "Scarcity",
    explanation: "When demand exceeds supply, this demonstrates scarcity.",
    difficulty: "easy",
    points: 10
  },
  {
    id: 23,
    category: "Scarcity",
    text: "Ang limitadong bilang ng classroom sa paaralan ay halimbawa ng:",
    options: [
      "Opportunity Cost",
      "Scarcity",
      "Trade-off",
      "Incentives"
    ],
    correctAnswer: "Scarcity",
    explanation: "Limited number of classrooms is an example of resource scarcity.",
    difficulty: "medium",
    points: 20
  },
  {
    id: 24,
    category: "Scarcity",
    text: "Ano ang pangunahing sanhi ng pagkakaroon ng scarcity?",
    options: [
      "Walang katapusang kagustuhan at limitadong pinagkukunang-yaman",
      "Sobrang produksyon ng mga produkto",
      "Mababang presyo ng bilihin",
      "Walang kontrol sa pondo ng gobyerno"
    ],
    correctAnswer: "Walang katapusang kagustuhan at limitadong pinagkukunang-yaman",
    explanation: "Scarcity exists because of unlimited wants but limited resources.",
    difficulty: "hard",
    points: 30
  }
];

export const events: EventCard[] = [
  {
    id: 1,
    description: "Good economic decision! Move forward 3 spaces.",
    effect: "move",
    value: 3
  },
  {
    id: 2,
    description: "Poor resource management. Move back 2 spaces.",
    effect: "move",
    value: -2
  },
  {
    id: 3,
    description: "Market crash! Skip your next turn.",
    effect: "skip",
    value: 1
  },
  {
    id: 4,
    description: "Economic boom! Roll the dice again.",
    effect: "reroll",
    value: 1
  },
  {
    id: 5,
    description: "Investment success! Move forward 2 spaces.",
    effect: "move",
    value: 2
  }
]; 