# EcoDash-African-Logistics

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Canvas-ff69b4?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-8a2be2?style=for-the-badge&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-Pink_Theme-da70d6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Module-WAS262-9370db?style=for-the-badge" />
</p>

<p align="center">
  <font color="#da70d6"><b>An interactive 2D HTML5 Canvas simulation addressing poor road infrastructure in rural Zambia.</b></font>
</p>

---

##  Project Overview

**EcoDash** is a 2D web-based simulation modeling the transport of essential supplies (medical goods, food, educational resources) across Zambian terrain using solar-powered electric vehicles. Built with Vanilla JavaScript, CSS3 and HTML5 Canvas, the application models vector physics, energy management, strong winds, and obstacle navigation.

---

##  Tech Stack

* **Rendering Engine**: HTML5 Canvas API
* **Styling**: CSS3
* **Logic**: Vanilla JavaScript
---

##  Final Design 

* **Overall**: Purple and Green will be the accent colours throughout the site
* **Theme**: The theme will be constantly dark and unchangeable. With dark grey-blue accent.
* **Font**: Overall the font on the site will be simple for visual aid.
* **Game Colour Palette**

| Deep Purple | Neon Mint | Electric Violet | Sea Green |
| :---: | :---: | :---: | :---: |
| <img src="https://placehold.co/100x100/52349e/52349e.png" width="100" height="100" alt="Deep Purple"> | <img src="https://placehold.co/100x100/00ff7a/00ff7a.png" width="100" height="100" alt="Neon Mint"> | <img src="https://placehold.co/100x100/8d52ff/8d52ff.png" width="100" height="100" alt="Electric Violet"> | <img src="https://placehold.co/100x100/38ae7b/38ae7b.png" width="100" height="100" alt="Sea Green"> |
| `#52349E` | `#00FF7A` | `#8D52FF` | `#38AE7B` |
##  Key Features

| Feature Category | Implementation Details |
| :--- | :--- |
| ** Physics & Movement** | Directional velocity, acceleration, drag, and trigonometric math calculations (`Math.cos`, `Math.sin`). |
| ** Charging mood** | Solar powered battery that refills once the car stops and recharges. |
| ** Infrastructure Identifier** | Identify foreign objects and road limits and notifies the driver if collision has occured. |
| ** Project Originality** | Project structure is a replica of a project called that was a game project. |
| ** Score keeping** | Local Storage is used to save the latest game settings and score board, with historical logs like collisions and failed missions. |

---

##  Final Project Folder Structure

```text
EcoDash/
├── index.html
├── Game Setup.html
├── Game.html
├── css/
│   ├── style.css
│   └── Game.css
├── js/
│   ├── Game Setup.js
│   └── Game.js
├── assets/
├── task1/
│   ├── Wireframe.pdf
│   └── Documantation.pdf
└── README.md
