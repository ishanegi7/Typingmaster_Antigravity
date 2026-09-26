🕹️ TYPE//TANK

Retro DOS-style arcade typing defense game built entirely with HTML5, CSS3, and Vanilla JavaScript.

TYPE//TANK is an intense, keyboard-first tactical typing game where you command a heavy artillery tank and defend your perimeter against a barrage of hostile words descending from orbit.

Lock onto incoming targets by typing their starting characters, aim your turret, and destroy threats before they breach your hull integrity.

✨ Features
🎯 Advanced Targeting System

Real-time target acquisition and threat prioritization

Type the beginning of hostile words to lock onto targets

Intelligent lowest-threat-first target selection

180° turret rotation

Real-time ballistic targeting

💥 Combat & Physics

60 FPS <canvas> rendering

Projectile and bullet-tracer effects

Procedural particle systems

Explosions and impact effects

Dynamic hull-damage feedback

Enemy breach and game-over mechanics

🔊 Procedural Audio

No audio files are required.

All game sounds are generated dynamically using the native Web Audio API, including:

🔫 Laser/fire effects

💥 Explosions

⚠️ Damage and impact sounds

🏆 Victory fanfares

Other arcade-style feedback effects

🖥️ Authentic Retro Aesthetic

Designed to recreate the atmosphere of classic DOS-era arcade terminals:

Deep black and phosphor-green color palette

CRT scanline overlays

Terminal-style UI

Phosphor glow effects

Arcade-inspired typography

Retro HUD and tactical readouts

📐 Viewport-Fit Architecture

The interface dynamically adapts to different screen sizes without requiring page scrolling.

Supported display modes:

AUTO — Automatically adapts to the viewport

16:9 — Modern widescreen presentation

4:3 — Classic CRT presentation

📊 Persistent Flight Logs

Your performance is stored locally in the browser.

Tracked statistics include:

Personal best scores

Words per minute (WPM)

Typing accuracy

Game performance across difficulty modes

No account or external server is required.

🔥 Arsenal Difficulty Modes

TYPE//TANK features four progressively challenging word arsenals:

Mode	Threat Level	Word Set
LOWERCASE	🟢	Lowercase words
MIXED CASE	🟡	Mixed uppercase/lowercase words
ALPHANUMERIC	🟠	Letters and numbers
MAXIMUM THREAT	🔴	Most challenging target combinations

Higher difficulty increases the complexity of incoming targets and demands greater typing accuracy and reaction speed.

🎮 How to Play

Watch the sky.
Hostile words descend toward your defensive perimeter.

Identify a target.
Targets are displayed as incoming threats.

Start typing.
Type the beginning characters of the target to acquire a lock.

Engage.
Once locked, the artillery system engages the target.

Destroy the threat.
Eliminate targets before they reach the perimeter.

Protect your hull.
Every enemy that breaches the defense reduces your hull integrity.

Survive as long as possible.
Build your score, WPM, and accuracy while keeping the perimeter intact.

⌨️ Controls

TYPE//TANK is designed around keyboard-first interaction.

Action	Input
Target enemies	Type target characters
Fire / engage	Automatic after target acquisition
Navigate menus	Keyboard controls
UI interaction	Mouse / pointer where available

Tip: Keep your eyes on the incoming targets and avoid looking down at the keyboard. Speed and accuracy are both critical.

🛠️ Technology

TYPE//TANK intentionally avoids frameworks and external dependencies.

Built with:

HTML5

CSS3

Vanilla JavaScript

HTML5 Canvas API

Web Audio API

LocalStorage API

Zero External Dependencies

There are:

❌ No React

❌ No Vue

❌ No game engine

❌ No external JavaScript libraries

❌ No external image assets

❌ No external audio files

Everything is generated and rendered directly in the browser.

🏗️ Architecture

At a high level, the game consists of several core systems:

┌─────────────────────────────────┐
│          TYPE//TANK             │
├─────────────────────────────────┤
│                                 │
│  Input System                   │
│       ↓                         │
│  Target Acquisition             │
│       ↓                         │
│  Threat Prioritization          │
│       ↓                         │
│  Turret / Ballistics            │
│       ↓                         │
│  Canvas Rendering                │
│       ↓                         │
│  Particle & Combat Effects      │
│       ↓                         │
│  Procedural Audio               │
│                                 │
│  ───────────────────────────    │
│  Local Flight Log / Statistics  │
└─────────────────────────────────┘


The main game loop runs continuously using browser animation timing, while canvas rendering handles the combat scene and Web Audio generates sound effects on demand.

💾 Data & Privacy

TYPE//TANK does not require a backend or user account.

Gameplay statistics are stored locally using the browser's LocalStorage mechanism.

This allows personal records such as scores, WPM, and accuracy to persist between sessions on the same browser/device.

Clearing browser site data may remove these records.

🌐 Running Locally

Because the project uses standard browser technologies, it can be run without installing a framework or dependency manager.

Option 1 — Open Directly

Open the project's HTML entry point in a modern browser.

Option 2 — Local Development Server

For the most reliable browser behavior, serve the project through a local HTTP server.

For example:

python -m http.server


Then open:

http://localhost:8000

🌍 Browser Support

TYPE//TANK is designed for modern browsers with support for:

HTML5 Canvas

Web Audio API

LocalStorage

Modern JavaScript

CSS animations and effects

For the best experience, use an up-to-date version of a Chromium-based browser, Firefox, or Safari.

🎨 Design Philosophy

TYPE//TANK follows three core principles:

FAST

The interface should react immediately to keyboard input.

FOCUSED

The player should spend their attention on incoming threats rather than menus or complicated controls.

RETRO

The visual language intentionally evokes the look and feel of classic DOS terminals and arcade defense systems.

🚀 Performance

The game is designed around a lightweight browser-native architecture.

Performance considerations include:

Canvas-based rendering

RequestAnimationFrame game loop

Procedural rather than asset-heavy effects

No framework runtime

No external network dependencies

Local client-side statistics

The viewport-fit system also allows the game to adapt its presentation to different display sizes.

📁 Project Structure

A typical project structure may look like:

TYPE-TANK/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── ...


The exact structure may vary depending on the current implementation.

🧪 Development

No build step is required for the core game.

You can modify the HTML, CSS, and JavaScript files and reload the browser to test changes.

When developing new gameplay features, pay particular attention to:

Frame-rate consistency

Keyboard input latency

Target acquisition behavior

Canvas scaling

Audio context restrictions

LocalStorage persistence

Mobile/touch behavior

🏆 Flight Log

Your mission performance can be measured through:

┌──────────────────────────────┐
│       FLIGHT LOG             │
├──────────────────────────────┤
│ SCORE       ████████████     │
│ WPM         ██████████       │
│ ACCURACY    ███████████      │
│ HULL        ████████         │
│ TARGETS     ████████████     │
└──────────────────────────────┘


Push your typing speed and accuracy higher while surviving increasingly difficult attack patterns.

⚠️ Known Considerations

Web Audio may require an initial user interaction before sound can play, depending on browser policies.

Local records are browser/device-specific.

Performance may vary on very low-powered devices.

The game is primarily designed around keyboard input.

📜 License

Add your preferred license here.

For example:

MIT License


If this project is intended to remain proprietary, replace this section with the appropriate copyright and usage terms.

🕹️ Mission Briefing

THE SKY IS FALLING.

THE WORDS ARE INCOMING.

TYPE FAST.

AIM TRUE.

DEFEND THE PERIMETER.

TYPE//TANK

Your keyboard is your weapon.
Your accuracy is your armor.
Your reaction time is the difference between survival and breach.
