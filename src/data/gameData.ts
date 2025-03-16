import { Question, EventCard, GameDifficulty, Category } from '../types/game';

// Questions for different difficulty levels
const questionsByDifficulty: Record<GameDifficulty, Question[]> = {
  beginner: [
    {
      id: 1,
      text: "Ito ang tumutukoy sa alternatibong isinuko mo sa iyong pagpili.",
      options: ["Marginal Thinking", "Trade-off", "Opportunity Cost", "Incentives"],
      correctAnswer: "Opportunity Cost",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "Ang opportunity cost ay ang pinakamahalagang alternatibong isinuko natin sa ating pagpili."
    },
    {
      id: 2,
      text: "Pinili ni Ana na mag-aral kaysa manood ng sine. Ano ang opportunity cost sa kanyang desisyon?",
      options: ["Oras na ginugol sa pag-aaral", "Pera para sa sine", "Kasiyahan sa panonood ng sine", "Gastos sa pagkain"],
      correctAnswer: "Kasiyahan sa panonood ng sine",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "Ang kasiyahan sa panonood ng sine ang naisuko ni Ana nang pinili niyang mag-aral."
    },
    {
      id: 3,
      text: "Ang isang magsasaka ay nagdesisyon na magtanim ng palay sa halip na mais. Ano ang opportunity cost?",
      options: ["Kita sa pagtatanim ng palay", "Gastos sa pagbili ng binhi", "Kita mula sa mais", "Oras ng pagtatanim"],
      correctAnswer: "Kita mula sa mais",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "Ang kita na maaaring makuha sa mais ang opportunity cost ng pagpiling magtanim ng palay."
    },
    {
      id: 4,
      text: "Ang pagpili ng kurso sa kolehiyo ay isang halimbawa ng:",
      options: ["Trade-off", "Scarcity", "Opportunity Cost", "Incentives"],
      correctAnswer: "Opportunity Cost",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "Kapag pumili ka ng isang kurso, may mga alternatibong kurso kang isinuko."
    },
    {
      id: 5,
      text: "Kapag naglaan ng oras sa paglalaro imbis na mag-aral, ang opportunity cost ay:",
      options: ["Kasiyahan sa paglalaro", "Marka sa pagsusulit", "Pera sa internet", "Oras sa pamilya"],
      correctAnswer: "Marka sa pagsusulit",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "Ang marka na maaari sanang makuha sa pagsusulit ang naisuko sa pagpiling maglaro."
    },
    {
      id: 6,
      text: "Ang pagtanggap ng mas mababang sweldo kapalit ng mas maikling oras ng trabaho ay halimbawa ng:",
      options: ["Trade-off", "Scarcity", "Opportunity Cost", "Incentives"],
      correctAnswer: "Trade-off",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "Ito ay trade-off dahil may pagpapalitan ng benepisyo at kapalit nito."
    },
    {
      id: 7,
      text: "Kapag pinili mong bumili ng cellphone imbis na damit, ano ang trade-off?",
      options: ["Oras sa pag-aaral", "Pera para sa damit", "Pera para sa pagkain", "Oras sa paglalaro"],
      correctAnswer: "Pera para sa damit",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "Ang pera na sana ay pambili ng damit ang trade-off sa pagpiling bumili ng cellphone."
    },
    {
      id: 8,
      text: "Ang desisyong mag-ipon kaysa gumastos ay isang halimbawa ng:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Incentives"],
      correctAnswer: "Trade-off",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "May kapalit na kasiyahan sa paggastos ang desisyong mag-ipon."
    },
    {
      id: 9,
      text: "Sa paggawa ng desisyon, ang pagtalikod sa isang pagpipilian ay tinatawag na:",
      options: ["Incentives", "Scarcity", "Trade-off", "Marginal Thinking"],
      correctAnswer: "Trade-off",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "Ang trade-off ay ang pagtalikod o pagsuko sa isang bagay para makuha ang isa pa."
    },
    {
      id: 10,
      text: "Ang pagsusuri kung sulit bang bumili ng dagdag na pizza ay halimbawa ng:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Incentives"],
      correctAnswer: "Marginal Thinking",
      category: "Marginal Thinking",
      difficulty: "easy",
      points: 1,
      explanation: "Ang pagsusuri ng karagdagang benepisyo o halaga ay marginal thinking."
    }
  ],
  intermediate: [
    {
      id: 11,
      text: "Kapag iniisip kung sulit ang karagdagang gastos para sa premium subscription, ito ay:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Incentives"],
      correctAnswer: "Marginal Thinking",
      category: "Marginal Thinking",
      difficulty: "medium",
      points: 2,
      explanation: "Ang pagsusuri ng karagdagang benepisyo o halaga ng premium subscription ay marginal thinking."
    },
    {
      id: 12,
      text: "Ang pagsusuri kung sulit bang mag-overtime ay halimbawa ng:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Scarcity"],
      correctAnswer: "Marginal Thinking",
      category: "Marginal Thinking",
      difficulty: "medium",
      points: 2,
      explanation: "Ang pagsusuri ng karagdagang benepisyo o halaga ng overtime ay marginal thinking."
    },
    {
      id: 13,
      text: "Ang pagtanggap ng dagdag na sahod para sa overtime ay isang halimbawa ng:",
      options: ["Opportunity Cost", "Trade-off", "Incentives", "Scarcity"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "medium",
      points: 2,
      explanation: "Ang dagdag na sahod ay nagsisilbing incentive o motivation para mag-overtime."
    },
    {
      id: 14,
      text: "Kapag nagbigay ang gobyerno ng diskwento sa buwis para sa mga negosyante, ito ay:",
      options: ["Opportunity Cost", "Trade-off", "Incentives", "Scarcity"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "medium",
      points: 2,
      explanation: "Ang diskwento sa buwis ay incentive para hikayatin ang mga negosyante."
    },
    {
      id: 15,
      text: "Ang pagbibigay ng bonus para sa maagang pagbabayad ng utang ay:",
      options: ["Trade-off", "Incentives", "Scarcity", "Opportunity Cost"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "medium",
      points: 2,
      explanation: "Ang bonus ay incentive para hikayatin ang maagang pagbabayad."
    }
  ],
  expert: [
    {
      id: 16,
      text: "Ang mga pagpipilian sa paggawa ng desisyon ay may magandang dulot. Ano ito?",
      options: ["Marginal Thinking", "Trade-off", "Opportunity Cost", "Incentives"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "hard",
      points: 3,
      explanation: "Ang incentives ay mga positibong dulot o motivation sa paggawa ng desisyon."
    },
    {
      id: 17,
      text: "Ang limitadong suplay ng bigas sa merkado ay isang halimbawa ng:",
      options: ["Trade-off", "Incentives", "Scarcity", "Opportunity Cost"],
      correctAnswer: "Scarcity",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "Ang limitadong suplay ng bigas ay nagpapakita ng scarcity o kakulangan."
    },
    {
      id: 18,
      text: "Kapag maraming nagnanais ngunit kakaunti ang suplay, ito ay:",
      options: ["Trade-off", "Scarcity", "Opportunity Cost", "Incentives"],
      correctAnswer: "Scarcity",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "Ang hindi pagtugma ng demand at supply ay scarcity."
    },
    {
      id: 19,
      text: "Ang limitadong bilang ng classroom sa paaralan ay halimbawa ng:",
      options: ["Opportunity Cost", "Scarcity", "Trade-off", "Incentives"],
      correctAnswer: "Scarcity",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "Ang limitadong bilang ng classroom ay halimbawa ng scarcity o kakulangan ng resources."
    },
    {
      id: 20,
      text: "Ano ang pangunahing sanhi ng pagkakaroon ng scarcity?",
      options: [
        "Walang katapusang kagustuhan at limitadong pinagkukunang-yaman",
        "Sobrang produksyon ng mga produkto",
        "Mababang presyo ng bilihin",
        "Walang kontrol sa pondo ng gobyerno"
      ],
      correctAnswer: "Walang katapusang kagustuhan at limitadong pinagkukunang-yaman",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "Ang hindi pagtugma ng unlimited wants at limited resources ang pangunahing sanhi ng scarcity."
    }
  ]
};

// Events for different difficulty levels
const eventsByDifficulty: Record<GameDifficulty, EventCard[]> = {
  beginner: [
    {
      id: 1,
      description: 'Magandang desisyon! Sumulong ng 2 spaces',
      effect: 'move',
      value: 2
    },
    {
      id: 2,
      description: 'May pagkakamali! Umurong ng 1 space',
      effect: 'move',
      value: -1
    }
  ],
  intermediate: [
    {
      id: 3,
      description: 'Mahusay na pag-iisip! Sumulong ng 3 spaces',
      effect: 'move',
      value: 3
    },
    {
      id: 4,
      description: 'Hindi tama ang desisyon! Umurong ng 2 spaces',
      effect: 'move',
      value: -2
    }
  ],
  expert: [
    {
      id: 5,
      description: 'Napakahusay! Sumulong ng 4 spaces',
      effect: 'move',
      value: 4
    },
    {
      id: 6,
      description: 'Mali ang strategy! Umurong ng 3 spaces',
      effect: 'move',
      value: -3
    }
  ]
};

export const getQuestions = (difficulty: GameDifficulty): Question[] => {
  return questionsByDifficulty[difficulty];
};

export const getEvents = (difficulty: GameDifficulty): EventCard[] => {
  return eventsByDifficulty[difficulty];
};

// For backward compatibility
export const questions = questionsByDifficulty.expert;
export const events = eventsByDifficulty.expert; 