# EcoDash-African-Logistics

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Canvas-ff69b4?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-8a2be2?style=for-the-badge&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-Pink_Theme-da70d6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Module-WAS262-9370db?style=for-the-badge" />
</p>

<p align="center">
  <font color="#da70d6"><b>An interactive 2D HTML5 Canvas simulation addressing real-world African infrastructure and logistics challenges.</b></font>
</p>

---

##  Project Overview

**EcoDash** is a 2D web-based simulation modeling the transport of essential supplies (medical goods, food, educational resources) across African terrain using solar-powered electric vehicles and drones. Built with Vanilla JavaScript and HTML5 Canvas, the application models vector physics, energy management, load-shedding conditions, and obstacle navigation.

---

##  Tech Stack

* **Rendering Engine**: HTML5 Canvas API
* **Styling**: CSS3 (Pink & Neon Purple UI Palette)
* **Logic**: Vanilla JavaScript (ES6+ Object-Oriented Programming)

---

##  Key Features

| Feature Category | Implementation Details |
| :--- | :--- |
| ** Physics & Movement** | Directional velocity, acceleration, drag, and trigonometric math calculations (`Math.cos`, `Math.sin`). |
| ** Solar Microgrid** | Dynamic battery consumption meter with solar recharging zones[cite: 1]. |
| ** Infrastructure Hazards** | Dynamic collision handling for load-shedding blackouts, potholes, rivers, and wildlife crossings[cite: 1]. |
| ** Original Feature** | Custom-coded canvas particle burst system on battery recharge (developed completely independent of AI assistance)[cite: 1]. |
| ** High Score Persistence** | LocalStorage integration tracking high scores, total distance, and energy efficiency[cite: 1]. |

---

##  Initial Project Folder Structure

```text
EcoDash-African-Logistics/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── vehicle.js
│   ├── obstacles.js
│   └── particles.js
├── assets/
│   ├── audio/
│   └── images/
├── docs/
│   ├── Wireframe.pdf
│   └── African_Context_Report.pdf
└── README.md
