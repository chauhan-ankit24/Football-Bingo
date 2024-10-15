
# 🎉 Bingo App  

This is a **Bingo game** built with **React Native** using TypeScript. The game presents a 3x3 grid and challenges the player to match answers with questions displayed at the top. The game includes a timer, tracks progress, and ends when three correct answers are selected or all questions are exhausted.

---

## 📝 Features  
- 3x3 grid with fixed answers for each game.  
- Timer-based gameplay with a 10-second countdown per question.  
- Win by selecting **3 correct answers** or answering all questions.  
- **Skip** functionality to move to the next question.  
- Images associated with some answers, including country flags and players.  
- Tracks remaining questions and displays a question counter.  
- Smooth transitions and progress tracking.

---

## 📦 Installation  

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/chauhan-ankit24/Football-Bingo.git
   cd bingo-app
   ```

2. **Install dependencies**:  
   ```bash
   npm install
   ```

3. **Run the app**:  
   ```bash
   npx react-native start
   npx react-native run-android # or run-ios for iOS
   ```

---

## 🖼️ Screenshots  
(Add some screenshots of the game in action here, if available.)

---

## 🛠️ Technologies Used  
- **React Native**  
- **TypeScript**  
- **react-native-progress** (for the circular timer)  

---

## 📂 Project Structure  

```
bingo-app
│
├── /src
│   ├── components/           # UI components (Grid, Timer, etc.)
│   ├── screens/              # Main screens of the app
│   ├── data/questionsData.ts # Questions & Answers data
│   └── App.tsx               # Entry point of the application
│
├── /assets                   # Images and assets used in the game
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

---

## 🧩 How to Play  
1. The **question** appears at the top.  
2. Select the **correct answer** from the 3x3 grid.  
3. **Timer** resets after every selection or when it hits 0 (auto-skip).  
4. **Win** by choosing 3 correct answers, or the game ends when all questions are completed.  

---

## 🔧 Configuration  
If you want to add or modify questions, open the `/src/data/questionsData.ts` file and modify the question and answer objects.

```ts
export const questions = [
  {
    question: 'Portugal',
    answer: {
      value: 'Cristiano Ronaldo',
      image: require('../assets/ronaldo.png'),
      correct: true,
    },
  },
  // Add more questions here...
];
```

---

## 🚀 Future Improvements  
- Add multiplayer support.  
- Introduce sound effects for win/lose events.  
- Allow users to shuffle questions or answers.  

---

## 🤝 Contributing  
Feel free to open an issue or submit a pull request if you'd like to contribute to the project.

---

## 📄 License  
This project is licensed under the **MIT License**.

---

## 🧑‍💻 Author  
Developed by **[Ankit Chauhan]**

---

## 📧 Contact  
For any inquiries or support, contact me at: **[akashchauhan72520@gmail.com]**
