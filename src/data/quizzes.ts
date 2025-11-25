export interface Quiz {
  id: string;
  title: string;
  description: string;
  image: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const quizzes: Quiz[] = [
  {
    id: "1",
    title: "DJ Alok Master",
    description: "Test your knowledge about DJ Alok's abilities and history",
    image: "/src/assets/dj-character.jpg",
    questions: [
      {
        id: "1",
        question: "What is DJ Alok's special ability called?",
        options: ["Drop the Beat", "Sonic Boom", "Bass Drop", "Music Wave"],
        correctAnswer: 0,
      },
      {
        id: "2",
        question: "DJ Alok's ability creates a healing zone that increases ally movement speed by?",
        options: ["5%", "10%", "15%", "20%"],
        correctAnswer: 1,
      },
      {
        id: "3",
        question: "What is the duration of DJ Alok's ability at max level?",
        options: ["5 seconds", "8 seconds", "10 seconds", "12 seconds"],
        correctAnswer: 2,
      },
      {
        id: "4",
        question: "DJ Alok was introduced in Free Fire in which year?",
        options: ["2018", "2019", "2020", "2021"],
        correctAnswer: 1,
      },
      {
        id: "5",
        question: "What type of character is DJ Alok?",
        options: ["Rusher", "Supporter", "Defender", "Sniper"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "2",
    title: "Sniper Expert",
    description: "Master the art of long-range combat",
    image: "/src/assets/sniper-character.jpg",
    questions: [
      {
        id: "1",
        question: "Which sniper rifle has the highest damage in Free Fire?",
        options: ["AWM", "Kar98k", "M82B", "SVD"],
        correctAnswer: 2,
      },
      {
        id: "2",
        question: "What is the effective range of AWM?",
        options: ["50m", "75m", "90m", "100m"],
        correctAnswer: 2,
      },
      {
        id: "3",
        question: "Which scope is best for long-range sniping?",
        options: ["2x", "4x", "8x", "Red Dot"],
        correctAnswer: 2,
      },
      {
        id: "4",
        question: "What attachment reduces sniper recoil the most?",
        options: ["Foregrip", "Stock", "Muzzle", "Barrel"],
        correctAnswer: 0,
      },
      {
        id: "5",
        question: "Which character ability helps with sniping accuracy?",
        options: ["Moco", "Kelly", "Olivia", "Ford"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "3",
    title: "Assault Tactics",
    description: "Prove your assault and combat strategy knowledge",
    image: "/src/assets/assault-character.jpg",
    questions: [
      {
        id: "1",
        question: "Which assault rifle has the highest fire rate?",
        options: ["M4A1", "AK47", "FAMAS", "GROZA"],
        correctAnswer: 2,
      },
      {
        id: "2",
        question: "What is the magazine capacity of AK47 without extensions?",
        options: ["25", "30", "35", "40"],
        correctAnswer: 1,
      },
      {
        id: "3",
        question: "Which throwable deals the most damage?",
        options: ["Frag Grenade", "Gloo Wall", "Smoke Grenade", "Flash"],
        correctAnswer: 0,
      },
      {
        id: "4",
        question: "What does the EP (Extra Points) bar represent?",
        options: ["Energy", "Armor", "Experience", "Extra Health"],
        correctAnswer: 0,
      },
      {
        id: "5",
        question: "Maximum armor capacity in Free Fire is?",
        options: ["100", "150", "200", "250"],
        correctAnswer: 2,
      },
    ],
  },
];
