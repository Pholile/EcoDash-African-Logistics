// ==========================================
// The whole and canvas js :|
// ==========================================

// 
var canvas = document.getElementById('gamCanv');
var ctx = canvas.getContext('2d');

//background cat logo and the stop sign
var fishImg = new Image();
fishImg.src = 'Assets/Fish.png';
var stopSignImg = new Image();
stopSignImg.src = 'Assets/Stop Sign.png';

//preloaded audios
var hornSound = new Audio('Assets/Car Horn.mp3');
var failedSound = new Audio('Assets/failed.mp3');
var successSound = new Audio('Assets/Sucess.mp3');
var rainySound = new Audio('Assets/Rainy.mp3');
var niceSound = new Audio('Assets/Nice.mp3');
var sqwishSound = new Audio('Assets/Sqwish.mp3');
var windySound = new Audio('Assets/Windy.mp3');

//looping for wind and rain
rainySound.loop = true;
windySound.loop = true;

//Helper function to play sound effects from the beginning, handling blocked playback errors
//try 3; added "carY = canvas.height - 150;"
 // "roadCenterX = (canvas.width - profileWidth) / 2;"
function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch(e => console.log("Audio play blocked:", e));
}
var playerName = localStorage.getItem('playerName') || 'Player';
var playerAvatar = localStorage.getItem('selectedAvatar') || 'Assets/male_avatar.png';
var vehicleName = localStorage.getItem('selectedVehicle') || 'BX600';
var avatarImg = new Image();
avatarImg.src = playerAvatar;
var vehicleImg = new Image();
vehicleImg.src = `Assets/${vehicleName}.png`;
var profileKey = `${playerName}_${playerAvatar}_globalDamage`;
var globalDamage = parseInt(localStorage.getItem(profileKey) || '0', 10);
var profileWidth = 320;
var roadCenterX = 0;


//resizing of th canvas based on window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  carY = canvas.height - 150;
  roadCenterX = (canvas.width - profileWidth) / 2;
}
window.addEventListener('resize', resizeCanvas);
var carX = window.innerWidth / 2;
var carY = window.innerHeight - 150;
var carVelocityX = 0;
var carSpeed = 5;
var baseSpeed = 5;
var maxSpeed = 15;
var acceleration = 0.03;
var braking = 0.05;
var friction = 0.92;
var carWidth = 60;
var carHeight = 100;
var score = 0;
var battery = 100;
var maxPackages = parseInt(localStorage.getItem('packages') || '1', 10);
var packages = maxPackages;
var isGamOvr = false;
var isGamStrated = false;
var isPaused = false;
var keys = {};
var obstacles = [];
var stopSigns = [];
var fishes = [];
var particles = [];
var rainParticles = [];
var ripples = [];
var windParticles = [];
var confettiParticles = [];
var stopTimer = 0;
var frameCount = 0;
var totalPotholesSpawned = 0;
var totalStopSignsSpawned = 0;
var totlFshSpwnd = 0;
var locationName = localStorage.getItem('destination') || 'Location 1';
var locationMultiplier = parseInt(locationName.replace(/\D/g, ''), 10) || 1;
var fishSpawnInterval = 900 * locationMultiplier;
var maxPothols = 6 * locationMultiplier;
var mxStpSgns = 10 * locationMultiplier;
var isGoingToWarehouse = false;
var finishLineSpawned = false;
var finishLineY = -100;
var isCharging = false;
var chargingPhase = 0;
var chargingTimer = 0;
var minPotholeDistance = 200;
var minSignDistance = 300;
var minDeliveryDistance = 150;
var carColor = localStorage.getItem('carColor') || '#0a993a';
var sesionDamag = 0;
var windActive = false;
var isRaining = false;
var deliveriesAttempted = 0;
var deliveriesSuccess = 0;
var lastDeliveryText = "None";


//the notifications for the gameplay itself; like "drop off close n stuff"
function showWarning(text) {
  var warningEl = document.getElementById('inGamWrning');
  if (warningEl) {
    warningEl.textContent = text;
    if (text.includes("warehouse") || text.includes("FISH")) {
      warningEl.style.color = "var(--primary-green)";
    } else {
      warningEl.style.color = "var(--alert-red)";
    }
    warningEl.classList.remove('hidden');
    setTimeout(() => {
      warningEl.classList.add('hidden');
    }, 3000);
  }
}
function togglePause() {
  if (!isGamStrated || isGamOvr) return;
  isPaused = !isPaused;
  var pauseModal = document.getElementById('pausModl');
  if (isPaused) {
    pauseModal.classList.remove('hidden');
    if (isRaining) rainySound.pause();
    if (windActive) windySound.pause();
  } else {
    pauseModal.classList.add('hidden');
    if (isRaining) rainySound.play().catch(e => console.log(e));
    if (windActive) windySound.play().catch(e => console.log(e));
  }
}
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.code === 'Space') {
    togglePause();
  }
  if ((e.key === 'h' || e.key === 'H') && isGamStrated && !isGamOvr && !isPaused) {
    playSound(hornSound);
  }
});
window.addEventListener('keyup', (e) => keys[e.key] = false);
var chargBttn = document.getElementById('chargBttn');
if (chargBttn) {
  chargBttn.addEventListener('click', () => {
    if (!isGamStrated || isGamOvr || isPaused || isCharging) return;
    isCharging = true;
    chargingPhase = 0;
    score -= 200;
    var notification = document.getElementById('chargNotif');
    if (notification) {
      notification.textContent = "We are now headin to the nearest charging station";
      notification.classList.remove('hidden');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 3000);
    }
  });
}
resizeCanvas();
carX = roadCenterX;
//randomly adding obstacles, signs, and packages
function spawnObjects() {
  if (!isGamStrated || isGamOvr || isPaused) return;
  frameCount++;
  if (totalPotholesSpawned < maxPothols && frameCount % 200 === 0 && Math.random() > 0.2) {
    var rand = Math.random();
    var type = rand > 0.6 ? 'pothole' : (rand > 0.3 ? 'rock' : 'pole');
    var newX = 0;
    if (type === 'pole') {
      var onLeft = Math.random() > 0.5;
      newX = roadCenterX + (onLeft ? -250 : 250);
    } else {
      newX = (roadCenterX - 150) + Math.random() * 300;
    }
    var newY = -50;
    var tooClose = obstacles.some(obs => Math.hypot(obs.x - newX, obs.y - newY) < minPotholeDistance);
    if (!tooClose) {
      obstacles.push({ x: newX, y: newY, radius: type === 'pole' ? 10 : 20, type: type, passed: false });
      totalPotholesSpawned++;
    }
  }
  if (totalStopSignsSpawned < mxStpSgns && frameCount % 550 === 0) {
    var onLeft = Math.random() > 0.5;
    var newX = roadCenterX + (onLeft ? -250 : 250);
    var newY = -50;
    var tooClose = stopSigns.some(s => Math.hypot(s.x - newX, s.y - newY) < minSignDistance);
    if (!tooClose) {
      stopSigns.push({ x: newX, y: newY, size: 40, active: true, stopped: false });
      totalStopSignsSpawned++;
    }
  }
  if (totlFshSpwnd < maxPackages && frameCount % fishSpawnInterval === 0) {
    var onLeft = Math.random() > 0.5;
    var newX = roadCenterX + (onLeft ? -200 : 200);
    var newY = -50;
    var tooCloseObs = obstacles.some(o => Math.hypot(o.x - newX, o.y - newY) < minDeliveryDistance);
    var tooCloseSign = stopSigns.some(s => Math.hypot(s.x - newX, s.y - newY) < minDeliveryDistance);
    if (!tooCloseObs && !tooCloseSign) {
      fishes.push({ x: newX, y: newY, size: 30, active: true });
      totlFshSpwnd++;
      showWarning("FISH DROP-OFF AHEAD!");
    }
  }
}
function makParticls(x, y, color, count) {
  for (var i = 0; i < count; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 1.0) * 15,
      life: 1.0 + Math.random() * 0.5,
      color: color,
      gravity: 0.5,
      drag: 0.95
    });
  }
}
function updateParticles() {
  if (isPaused) return;
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}
function updateRain() {
  if (isPaused || !isGamStrated || !isRaining) return;
  if (Math.random() < 0.6) {
    for (var i = 0; i < 3; i++) {
      rainParticles.push({
        x: Math.random() * (canvas.width - profileWidth),
        y: -20,
        vy: 15 + Math.random() * 10,
        vx: 1 + Math.random() * 2,
        length: 10 + Math.random() * 15
      });
    }
  }
  for (var i = rainParticles.length - 1; i >= 0; i--) {
    var p = rainParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.y > canvas.height) {
      if (Math.random() < 0.3) {
        ripples.push({
          x: p.x,
          y: canvas.height - Math.random() * 300,
          radius: 1,
          maxRadius: 10 + Math.random() * 15,
          alpha: 0.5
        });
      }
      rainParticles.splice(i, 1);
    }
  }
  for (var i = ripples.length - 1; i >= 0; i--) {
    var r = ripples[i];
    r.radius += 0.5;
    r.alpha -= 0.02;
    if (r.alpha <= 0) {
      ripples.splice(i, 1);
    }
  }
}
function drawRain() {
  ctx.strokeStyle = 'rgba(150, 200, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  rainParticles.forEach(p => {
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx, p.y - p.length);
  });
  ctx.stroke();
  ripples.forEach(r => {
    ctx.strokeStyle = `rgba(150, 200, 255, ${r.alpha})`;
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.radius * 2, r.radius, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
}
function updateWind() {
  if (isPaused || !isGamStrated || !windActive) return;
  if (Math.random() < 0.5) {
    windParticles.push({
      x: canvas.width - profileWidth + 50,
      y: Math.random() * canvas.height,
      vx: -15 - Math.random() * 10,
      vy: carSpeed + (Math.random() - 0.5) * 2,
      length: 20 + Math.random() * 40
    });
  }
  for (var i = windParticles.length - 1; i >= 0; i--) {
    var p = windParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -50 || p.y > canvas.height + 50) {
      windParticles.splice(i, 1);
    }
  }
}
function drawWind() {
  if (!windActive) return;
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  windParticles.forEach(p => {
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.length, p.y - p.length * 0.2);
  });
  ctx.stroke();
}
//thse loop mechanics handling physics, movement, and collisions
function updatPhysic() {
  //whne the game hasn't started, is over, or is paused, do not update physics
  if (!isGamStrated || isGamOvr || isPaused) return;
  
  //wind pushing the car to the left
  if (windActive) {
    carX -= 0.4;
  }
  
  //the charging station
  if (isCharging) {
    if (chargingPhase === 0) {
      //first driving off the screen to the side; to create the illusion of charging at a station
      carVelocityX = -1;
      carX += carVelocityX;
      carSpeed *= 0.98; //Gradually slow down
      if (carX <= roadCenterX - 250) {
        //now the car starts charging up
        chargingPhase = 1;
        chargingTimer = 180; //setting teh  timer for how long to charge
        carSpeed = 0;
        carVelocityX = 0;
      }
    } else if (chargingPhase === 1) {
      //car is currently charging
      chargingTimer--;
      battery += 0.5; //increase battery percent
      if (battery > 100) battery = 100; //ending at 1005
      if (chargingTimer <= 0) {
        //When timer runs out, transition to driving back onto the road
        chargingPhase = 2;
      }
    } else if (chargingPhase === 2) {
      //lastely drive the car back onto the road
      carVelocityX = 1;
      carX += carVelocityX;
      carSpeed += acceleration;
      if (carX >= roadCenterX) {
        //charge is doen, back to contrillong
        isCharging = false;
        carVelocityX = 0;
        var notification = document.getElementById('chargNotif');
        if (notification) {
          notification.textContent = "we are back on the deilvery route. ";
          notification.classList.remove('hidden');
          setTimeout(() => notification.classList.add('hidden'), 3000);
        }
      }
    }
  } else {


    //back to normal driving controls (when not charging)
    
    //let and right movement handling
    if (keys['ArrowLeft']) carVelocityX -= 0.5;
    if (keys['ArrowRight']) carVelocityX += 0.5;
    
    //Applying the friction to slowly stop horizontal movement when keys are released
    carVelocityX *= friction;
    carX += carVelocityX;
    
    //stopping the car from driving off the screen
    if (carX < carWidth) carX = carWidth;
    if (carX > canvas.width - profileWidth - carWidth) carX = canvas.width - profileWidth - carWidth;
    
    //forwardn and slow down moveing (Speed) handling
    if (keys['ArrowUp']) {
      //accelerate the car up to the max speed
      carSpeed += acceleration;
      var currentMax = windActive ? maxSpeed * 0.75 : maxSpeed; // Wind reduces max speed
      if (carSpeed > currentMax) carSpeed = currentMax;
      battery -= 0.05; // Accelerating drains battery faster
    } else if (keys['ArrowDown']) {
      //slow down the car
      carSpeed -= braking;
      if (carSpeed < 0) carSpeed = 0;
    } else {
      var currentBase = windActive ? baseSpeed * 0.75 : baseSpeed;
      if (carSpeed > currentBase) {
        carSpeed -= acceleration;
        if (carSpeed < currentBase) carSpeed = currentBase;
      } else if (carSpeed < currentBase) {
        carSpeed += acceleration;
        if (carSpeed > currentBase) carSpeed = currentBase;
      }
      battery -= 0.01;
    }
    var leftBoundary = roadCenterX - 200;
    var rightBoundary = roadCenterX + 200;
    if (carX < leftBoundary + carWidth / 2 || carX > rightBoundary - carWidth / 2) {
      score -= 0.1;
    }
  }
  if (battery <= 0) {
    triggerGameOver("Battery depleted! Mission Failed.");
  }
  for (var i = obstacles.length - 1; i >= 0; i--) {
    var obs = obstacles[i];
    obs.y += carSpeed;
    var dist = Math.hypot(carX - obs.x, carY - obs.y);
    if (dist < obs.radius + Math.max(carWidth, carHeight) / 2 - 10) {
      score -= 50;
      sesionDamag++;
      playSound(hornSound);
      globalDamage++;
      localStorage.setItem(profileKey, globalDamage);
      makParticls(obs.x, obs.y, '#4a1587', 15);
      obstacles.splice(i, 1);
      if (sesionDamag >= 4) {
        triggerGameOver("Car took too much damage; the fixers will come pick it up. Mission Failed.");
        break;
      }
    } else if (!obs.passed && obs.y > carY + carHeight / 2) {
      obs.passed = true;
      score += 50;
      makParticls(obs.x, obs.y, '#0a993a', 10);
      playSound(sqwishSound);
    } else if (obs.y > canvas.height + 50) {
      obstacles.splice(i, 1);
    }
  }
  for (var i = stopSigns.length - 1; i >= 0; i--) {
    var sign = stopSigns[i];
    sign.y += carSpeed;
    if (sign.active) {
      if (Math.abs(sign.y - carY) < 100) {
        if (carSpeed <= 0.1 && !sign.stopped) {
          score += 50;
          sign.stopped = true;
          sign.active = false;
          makParticls(carX, carY, '#0a993a', 20);
          playSound(sqwishSound);
        }
      } else if (sign.y > carY + 100 && !sign.stopped) {
        score -= 50;
        sign.active = false;
        makParticls(carX, carY, '#4a1587', 20);
      }
    }
    if (sign.y > canvas.height + 50) {
      stopSigns.splice(i, 1);
    }
  }
  for (var i = fishes.length - 1; i >= 0; i--) {
    var fish = fishes[i];
    fish.y += carSpeed;
    if (fish.active) {
      var dist = Math.hypot(carX - fish.x, carY - fish.y);
      if (dist < 100 && carSpeed < 0.5) {
        score += 200;
        if (packages > 0) packages--;
        fish.active = false;
        deliveriesAttempted++;
        deliveriesSuccess++;
        lastDeliveryText = "Success (+200)";
        makParticls(fish.x, fish.y, '#4a1587', 30);
        playSound(successSound);
      }
    }
    if (fish.y > canvas.height + 50) {
      if (fish.active) {
        score -= 200;
        deliveriesAttempted++;
        lastDeliveryText = "Missed (-200)";
        makParticls(fish.x, fish.y, '#4a1587', 20);
      }
      fishes.splice(i, 1);
    }
  }
  if (!isGoingToWarehouse && totlFshSpwnd === maxPackages && fishes.length === 0) {
    isGoingToWarehouse = true;
    showWarning("Delivery truck is now going to the warehouse.");
  }
  if (isGoingToWarehouse && !finishLineSpawned) {
    finishLineSpawned = true;
    finishLineY = -100;
  }
  if (finishLineSpawned) {
    finishLineY += carSpeed;
    if (finishLineY > carY && !isGamOvr) {
      triggerGameWin();
    }
  }
  updateParticles();
  updateHUD();
  updateWind();
}
// Renders the sky gradient to create the illusion o0f  day/night cycles
function renderSky() {
  var playAreaWidth = canvas.width - profileWidth;
  var timeCycle = (Date.now() % 120000) / 120000;
  var rTop, gTop, bTop, rBot, gBot, bBot;
  if (timeCycle < 0.5) {
    var t = timeCycle * 2;
    rTop = 135 + (253 - 135) * t;
    gTop = 206 + (184 - 206) * t;
    bTop = 235 + (19 - 235) * t;
    rBot = 255; gBot = 255; bBot = 255;
  } else {
    var t = (timeCycle - 0.5) * 2;
    rTop = 253 + (10 - 253) * t;
    gTop = 184 + (10 - 184) * t;
    bTop = 19 + (30 - 19) * t;
    rBot = 255 - 245 * t; gBot = 255 - 245 * t; bBot = 255 - 235 * t;
  }
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, `rgb(${Math.floor(rTop)}, ${Math.floor(gTop)}, ${Math.floor(bTop)})`);
  gradient.addColorStop(1, `rgb(${Math.floor(rBot)}, ${Math.floor(gBot)}, ${Math.floor(bBot)})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, playAreaWidth, canvas.height);
}
//draw loop rendering the road, objects, and UI elements
function render() {
  renderSky();
  var playAreaWidth = canvas.width - profileWidth;
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.moveTo(roadCenterX - 100, 0);
  ctx.lineTo(roadCenterX + 100, 0);
  ctx.lineTo(roadCenterX + 400, canvas.height);
  ctx.lineTo(roadCenterX - 400, canvas.height);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.setLineDash([20, 20]);
  if (!isPaused && carSpeed > 0) {
    ctx.lineDashOffset = -score * 2 - (Date.now() / 10 % 40);
  }
  ctx.beginPath();
  ctx.moveTo(roadCenterX, 0);
  ctx.lineTo(roadCenterX, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  obstacles.forEach(obs => {
    if (obs.type === 'pothole') {
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath();
      ctx.ellipse(obs.x, obs.y, obs.radius * 1.5, obs.radius, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'rock') {
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'pole') {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(obs.x - 5, obs.y - 40, 10, 40);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(obs.x - 5, obs.y - 20, 10, 10);
    }
  });
  fishes.forEach(fish => {
    if (fish.active) {
      ctx.drawImage(fishImg, fish.x - 30, fish.y - 30, 60, 60);
      ctx.fillStyle = '#0a993a';
      ctx.beginPath();
      ctx.moveTo(fish.x, fish.y - 40);
      ctx.lineTo(fish.x - 10, fish.y - 60);
      ctx.lineTo(fish.x + 10, fish.y - 60);
      ctx.fill();
    }
  });
  stopSigns.forEach(sign => {
    if (sign.active) {
      ctx.drawImage(stopSignImg, sign.x - sign.size, sign.y - sign.size, sign.size * 2, sign.size * 2);
    }
  });
  drawRain();
  drawWind();
  if (finishLineSpawned) {
    ctx.fillStyle = '#fff';
    for (var i = 0; i < playAreaWidth; i += 40) {
      if ((i / 40) % 2 === 0) {
        ctx.fillRect(i, finishLineY, 40, 40);
        ctx.fillStyle = '#000';
        ctx.fillRect(i, finishLineY + 40, 40, 40);
        ctx.fillStyle = '#fff';
      } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(i, finishLineY, 40, 40);
        ctx.fillStyle = '#fff';
        ctx.fillRect(i, finishLineY + 40, 40, 40);
      }
    }
  }
  ctx.save();
  ctx.translate(carX, carY);
  ctx.fillStyle = '#111';
  ctx.fillRect(-carWidth / 2 - 5, -carHeight / 2 + 10, 10, 20);
  ctx.fillRect(carWidth / 2 - 5, -carHeight / 2 + 10, 10, 20);
  ctx.fillRect(-carWidth / 2 - 5, carHeight / 2 - 30, 10, 20);
  ctx.fillRect(carWidth / 2 - 5, carHeight / 2 - 30, 10, 20);
  ctx.fillStyle = carColor;
  ctx.fillRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(-carWidth / 2 + 5, -carHeight / 2 + 5, carWidth - 10, carHeight / 3);
  ctx.restore();
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  });
  if (confettiParticles.length > 0) {
    confettiParticles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      p.rotation += p.rotationSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
  }
  if (!isGamOvr || (isGamOvr && particles.length > 0) || confettiParticles.length > 0) {
    requestAnimationFrame(() => {
      spawnObjects();
      updatPhysic();
      updateRain();
      render();
    });
  }
}
//cahngeing the Heads Up Display(HUD) with current game state variables
function updateHUD() {
  var batryFil = document.getElementById('batryFil');
  if (batryFil) batryFil.style.width = `${Math.max(0, battery)}%`;
  var batryTxt = document.getElementById('batryTxt');
  if (batryTxt) batryTxt.textContent = `${Math.round(battery)}%`;
  var spedDisp = document.getElementById('spedDisp');
  if (spedDisp) spedDisp.textContent = `${Math.round(carSpeed * 10)} km/h`;
  var scorDisp = document.getElementById('scorDisp');
  if (scorDisp) scorDisp.textContent = Math.floor(score);
  var packagesEl = document.getElementById('packgDisp');
  if (packagesEl) packagesEl.textContent = packages;
  var cScore = document.getElementById('cardScore');
  if (cScore) cScore.textContent = Math.floor(score);
  var cRecent = document.getElementById('cardRecent');
  if (cRecent) cRecent.textContent = lastDeliveryText;
  var cAttempts = document.getElementById('cardAttempts');
  if (cAttempts) cAttempts.textContent = deliveriesAttempted;
  var cSuccess = document.getElementById('cardSuccess');
  if (cSuccess) cSuccess.textContent = deliveriesSuccess;
  var cDamage = document.getElementById('cardDamage');
  if (cDamage) {
    cDamage.textContent = sesionDamag + "/4";
    if (sesionDamag >= 3) cDamage.style.color = 'var(--alert-red)';
    else cDamage.style.color = 'var(--text-main)';
  }
  var pSessionHits = document.getElementById('profileSessionHits');
  if (pSessionHits) pSessionHits.textContent = "Current Session Hits: " + sesionDamag + "/4";
  var pGlobalDamage = document.getElementById('profileGlobalDamage');
  if (pGlobalDamage) pGlobalDamage.textContent = "Global Damage: " + globalDamage;
}
//for the logic when the player fails the mission
function triggerGameOver(reason) {
  isGamOvr = true;
  playSound(failedSound);
  windySound.pause();
  rainySound.pause();
  document.getElementById('modlTitl').textContent = "MISSION FAILED";
  document.getElementById('modlTitl').style.color = "var(--alert-red)";
  document.getElementById('modlReasn').textContent = reason;
  document.getElementById('finlScor').textContent = Math.floor(score);
  document.getElementById('gamOvrModl').classList.remove('hidden');
}
//the logic when the player successfully completes the route
function triggerGameWin() {
  isGamOvr = true;
  carSpeed = 0;
  windySound.pause();
  rainySound.pause();
  if (deliveriesSuccess === maxPackages) {
    playSound(niceSound);
    document.getElementById('modlTitl').textContent = "SUCCESSFULLY COMPLETED";
    document.getElementById('modlTitl').style.color = "var(--primary-green)";
    document.getElementById('modlReasn').textContent = "All deliveries made!";
    for (var i = 0; i < 150; i++) {
      confettiParticles.push({
        x: Math.random() * (canvas.width - profileWidth),
        y: Math.random() * -canvas.height,
        size: 5 + Math.random() * 10,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        vy: 2 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
  } else {
    playSound(failedSound);
    document.getElementById('modlTitl').textContent = "SUCCESSFULLY COMPLETED";
    document.getElementById('modlTitl').style.color = "var(--primary-green)";
    document.getElementById('modlReasn').textContent = "You successfully made it back but not all the deliveries were made.";
  }
  document.getElementById('finlScor').textContent = Math.floor(score);
  setTimeout(() => {
    document.getElementById('gamOvrModl').classList.remove('hidden');
  }, 2000);
}
function initSessionWeather() {
  var rand = Math.random();
  rainySound.pause();
  windySound.pause();
  isRaining = false;
  windActive = false;
  if (rand < 0.3) {
    isRaining = true;
    rainySound.play().catch(e => console.log(e));
  } else if (rand < 0.6) {
    windActive = true;
    windySound.play().catch(e => console.log(e));
  }
}
var restrtBttn = document.getElementById('restrtBttn');
if (restrtBttn) {
  restrtBttn.addEventListener('click', () => {
    carX = roadCenterX;
    carVelocityX = 0;
    carSpeed = 5;
    battery = 100;
    score = 0;
    sesionDamag = 0;
    deliveriesAttempted = 0;
    deliveriesSuccess = 0;
    lastDeliveryText = "None";
    locationName = localStorage.getItem('destination') || 'Location 1';
    locationMultiplier = parseInt(locationName.replace(/\D/g, ''), 10) || 1;
    fishSpawnInterval = 900 * locationMultiplier;
    maxPothols = 6 * locationMultiplier;
    mxStpSgns = 10 * locationMultiplier;
    maxPackages = parseInt(localStorage.getItem('packages') || '1', 10);
    packages = maxPackages;
    totalPotholesSpawned = 0;
    totalStopSignsSpawned = 0;
    totlFshSpwnd = 0;
    isGoingToWarehouse = false;
    finishLineSpawned = false;
    windActive = false;
    isRaining = false;
    isPaused = false;
    isCharging = false;
    obstacles = [];
    stopSigns = [];
    fishes = [];
    particles = [];
    rainParticles = [];
    ripples = [];
    confettiParticles = [];
    windParticles = [];
    isGamOvr = false;
    carColor = localStorage.getItem('carColor') || '#0a993a';
    document.getElementById('gamOvrModl').classList.add('hidden');
    initSessionWeather();
    render();
  });
}
document.getElementById('resumBttn')?.addEventListener('click', togglePause);
document.getElementById('qitBttn')?.addEventListener('click', () => {
  window.location.href = 'Game Setup.html';
});
document.getElementById('qitGamOvrBttn')?.addEventListener('click', () => {
  window.location.href = 'Game Setup.html';
});
document.addEventListener('DOMContentLoaded', () => {
  var aImg = document.getElementById('startAvatarImg');
  if (aImg) aImg.src = playerAvatar;
  var sName = document.getElementById('startPlayerName');
  if (sName) sName.textContent = playerName;
  var vImg = document.getElementById('startVehicleImg');
  if (vImg) vImg.src = `Assets/${vehicleName}.png`;
  var vName = document.getElementById('startVehicleName');
  if (vName) vName.textContent = vehicleName;
  var pAvatar = document.getElementById('profileAvatar');
  if (pAvatar) pAvatar.src = playerAvatar;
  var pName = document.getElementById('profileName');
  if (pName) pName.textContent = playerName;
  var pVehicle = document.getElementById('profileVehicle');
  if (pVehicle) pVehicle.src = `Assets/${vehicleName}.png`;
  var pVehicleName = document.getElementById('profileVehicleName');
  if (pVehicleName) {
    pVehicleName.textContent = vehicleName;
    pVehicleName.style.color = carColor;
  }
  var btn = document.getElementById('strtGamBttn');
  if (btn) {
    btn.addEventListener('click', () => {
      document.getElementById('preGamOvrly').classList.add('hidden');
      document.getElementById('plyrProfilBaner').classList.remove('hidden');
      document.getElementById('scorCrd').classList.remove('hidden');
      isGamStrated = true;
      initSessionWeather();
    });
  }
});
render();