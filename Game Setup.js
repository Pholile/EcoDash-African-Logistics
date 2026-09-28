document.addEventListener('DOMContentLoaded', () => {
  var avatarBtns = document.querySelectorAll('.avatr-bttn');
  var summaryAvatar = document.querySelector('.summary-avatar');
  var playerNameInput = document.getElementById('plyrNam');
  var distInpt = document.getElementById('distInpt');
  var destnInpt = document.getElementById('destnInpt');
  var packgInpt = document.getElementById('packgInpt');
  var vehiclImg = document.getElementById('vehiclImg');
  var sumryVehiImg = document.getElementById('sumryVehiImg');
  var vehiBadg = document.getElementById('vehiBadg');
  var updateVehicle = (distanceVal) => {
    var dist = parseInt(distanceVal, 10) || 1;
    var vehicleName = dist < 60 ? 'BX600' : 'BX1200';
    var vehicleSrc = `Assets/${vehicleName}.png`;
    if (vehiclImg) vehiclImg.setAttribute('src', vehicleSrc);
    if (sumryVehiImg) sumryVehiImg.setAttribute('src', vehicleSrc);
    if (vehiBadg) vehiBadg.textContent = vehicleName;
    localStorage.setItem('selcVehicl', vehicleName);
  };
  var savedAvatar = localStorage.getItem('selcAvatr');
  if (savedAvatar && summaryAvatar) {
    summaryAvatar.setAttribute('src', savedAvatar);
    avatarBtns.forEach(btn => {
      if (btn.querySelector('img').getAttribute('src') === savedAvatar) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }
  if (playerNameInput) {
    var savedName = localStorage.getItem('plyrNam');
    if (savedName) playerNameInput.value = savedName;
    var nameBadge = document.querySelector('.summary-item .name-badge');
    if (nameBadge) nameBadge.textContent = playerNameInput.value || 'Player';
  }
  if (distInpt) {
    var savedDistance = localStorage.getItem('distance');
    if (savedDistance) distInpt.value = savedDistance;
    updateVehicle(distInpt.value);
  }
  if (destnInpt && localStorage.getItem('destination')) destnInpt.value = localStorage.getItem('destination');
  if (packgInpt && localStorage.getItem('packages')) packgInpt.value = localStorage.getItem('packages');
  avatarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      avatarBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      var imgSrc = btn.querySelector('img').getAttribute('src');
      if (summaryAvatar) summaryAvatar.setAttribute('src', imgSrc);
      localStorage.setItem('selcAvatr', imgSrc);
    });
  });
  if (playerNameInput) {
    playerNameInput.addEventListener('input', (e) => {
      var val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
      if (val.length > 10) val = val.substring(0, 10);
      e.target.value = val;
      var nameBadge = document.querySelector('.summary-item .name-badge');
      if (nameBadge) nameBadge.textContent = val || 'Player';
      localStorage.setItem('plyrNam', val);
    });
  }
  if (distInpt) {
    var clampDistance = () => {
      var num = parseInt(distInpt.value, 10);
      if (isNaN(num)) num = 1;
      if (num < 1) num = 1;
      if (num > 100) num = 100;
      distInpt.value = num;
      localStorage.setItem('distance', num);
      updateVehicle(num);
    };
    distInpt.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      localStorage.setItem('distance', e.target.value);
      updateVehicle(e.target.value);
    });
    distInpt.addEventListener('change', clampDistance);
  }
  if (destnInpt) {
    destnInpt.addEventListener('change', (e) => {
      localStorage.setItem('destination', e.target.value);
    });
  }
  if (packgInpt) {
    var clampPackages = () => {
      var num = parseInt(packgInpt.value, 10);
      if (isNaN(num)) num = 1;
      if (num < 1) num = 1;
      if (num > 5) num = 5;
      packgInpt.value = num;
      localStorage.setItem('packages', num);
    };
    packgInpt.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      localStorage.setItem('packages', e.target.value);
    });
    packgInpt.addEventListener('change', clampPackages);
  }
});