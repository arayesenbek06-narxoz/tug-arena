# 🪢 TUG ARENA

Tug Arena is a browser-based tug-of-war game where the player competes against an AI-controlled bot.

The game combines stamina management, strategic decisions, difficulty levels, and real-time interactions. The goal is to pull the rope toward your side before the opponent wins.

## 🎮 How to Play

The player competes against the bot in a 30-second tug-of-war match.

You have two main actions:

- **PULL** — performs a normal pull and uses a small amount of stamina.
- **POWER PULL** — performs a much stronger pull but consumes significantly more stamina.

You can also use the keyboard:

- `SPACE` — Normal Pull
- `E` — Power Pull

The player must manage stamina carefully because using Power Pull too often can leave the player without enough energy.

## 🤖 Difficulty Levels

Before starting the game, the player can choose one of three difficulty levels:

### EASY
The bot reacts more slowly and applies less pressure.

Recommended for new players.

### NORMAL
Balanced bot behavior and stamina usage.

This is the default difficulty.

### HARD
The bot is faster and more aggressive, making Power Pull decisions more effectively.

This mode requires better stamina management and timing.

## ⚡ Stamina System

Both the player and the bot have limited stamina.

Normal pulls consume a small amount of stamina, while Power Pull consumes much more.

Stamina gradually recovers during the match.

This means the player cannot simply spam the strongest action and must decide when to attack and when to recover.

## 🧠 Bot Logic

The opponent is controlled using JavaScript.

The bot:

- automatically performs pulls;
- monitors its stamina;
- rests when stamina becomes too low;
- can perform Power Pulls;
- changes its behavior depending on the selected difficulty.

Randomized decision-making is also used so that matches are not completely predictable.

## 🏆 Winning the Game

The match can end when:

- the rope reaches the player's winning position;
- the rope reaches the bot's winning position;
- the timer reaches zero.

After the match, the game displays the result and allows the player to start a rematch.

## 📊 Player Statistics

Tug Arena tracks:

- Wins
- Losses
- Total Matches

The statistics are stored using the browser's `localStorage`.

This means statistics remain available after refreshing or reopening the page on the same browser.

Each browser/device has its own statistics.

## ✨ Animations

The game includes visual feedback for player actions.

Normal Pull and Power Pull trigger different animations for the rope and characters, making stronger actions visually distinguishable during gameplay.

## 🛠 Technologies Used

- HTML5
- CSS3
- JavaScript
- LocalStorage
- GitHub
- GitHub Pages

No external JavaScript frameworks are required.

## 📁 Project Structure

```text
tug-arena/
│
├── index.html
├── style.css
├── script.js
└── README.md
