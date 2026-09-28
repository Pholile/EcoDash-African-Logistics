// Initialize the game setup preview when the DOM(document object model) is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  //Select all avatar buttons so we can save their selection
  var avatarBtns = document.querySelectorAll('.avatr-bttn');
  //the avatar image shown in the preview on the right
  var summaryAvatar = document.querySelector('.summary-avatar');
  //input for the name
  var playerNameInput = document.getElementById('plyrNam');
  //inptu for the distance they want travel
  var distInpt = document.getElementById('distInpt');
  //input for destination or location
  var destnInpt = document.getElementById('destnInpt');
  //input for package number to be dropped off
  var packgInpt = document.getElementById('packgInpt');
//image for the vechle select for the player
  var vehiclImg = document.getElementById('vehiclImg');
  //vehicle image shown in the preview
  var sumryVehiImg = document.getElementById('sumryVehiImg');
  //text uner the car on the preview; added last
  var vehiBadg = document.getElementById('vehiBadg');
  //fnction to update the selected vehicle based on distance inputted
  var updateVehicle = (distanceVal) => {
    var dist = parseInt(distanceVal, 10) || 1;
    var vehicleName = dist < 60 ? 'BX600' : 'BX1200';
    var vehicleSrc = `Assets/${vehicleName}.png`;
    if (vehiclImg) vehiclImg.setAttribute('src', vehicleSrc);
    if (sumryVehiImg) sumryVehiImg.setAttribute('src', vehicleSrc);
    if (vehiBadg) vehiBadg.textContent = vehicleName;
    localStorage.setItem('selcVehicl', vehicleName);
  };
  //get and apply the previously saved avator from local storage
  var savedAvatar = localStorage.getItem('selcAvatr');
  if (savedAvatar && summaryAvatar) {
    //added and update the src of trhe images based on what was choosen
    summaryAvatar.setAttribute('src', savedAvatar);
    
    //loping through all avatar buttons to highlight the saved one
    avatarBtns.forEach(btn => {
      //check if this button's image matches the saved avatar
      if (btn.querySelector('img').getAttribute('src') === savedAvatar) {
        btn.classList.add('selected'); // Highlight selected
      } else {
        btn.classList.remove('selected'); // Remove highlight from others
      }
    });
  }
  
  //Setup the player name input with the saved data
  if (playerNameInput) {
    var savedName = localStorage.getItem('plyrNam');
    if (savedName) playerNameInput.value = savedName; // Populate input
    
    //update the summary name to shpow the saved name
    var nameBadge = document.querySelector('.summary-item .name-badge');
    if (nameBadge) nameBadge.textContent = playerNameInput.value || 'Player';
  }
  
  //Setup the distance input with the saved data
  if (distInpt) {
    var savedDistance = localStorage.getItem('distance');
    if (savedDistance) distInpt.value = savedDistance;
    //Call updateVehicle to ensure the correct vehicle is the samefor this distance
    updateVehicle(distInpt.value);
  }
  
  //Pre-fill destination and packages from local storage if available
  if (destnInpt && localStorage.getItem('destination')) destnInpt.value = localStorage.getItem('destination');
  if (packgInpt && localStorage.getItem('packages')) packgInpt.value = localStorage.getItem('packages');
  
  //Adding click event listeners to all avatar buttons for selection
  avatarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      //Clearingg selection from all buttons first
      avatarBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
            var imgSrc = btn.querySelector('img').getAttribute('src');//updating
      if (summaryAvatar) summaryAvatar.setAttribute('src', imgSrc);
      localStorage.setItem('selcAvatr', imgSrc);//save to local storage
    });
  });
  
  //setting ten logic for player name input
  if (playerNameInput) {
    playerNameInput.addEventListener('input', (e) => {
      //text vaildation
      var val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
      // for less tyhan 10 charactors
      if (val.length > 10) val = val.substring(0, 10);
      e.target.value = val;
      
      //Live-update the name badge in the preview
      var nameBadge = document.querySelector('.summary-item .name-badge');
      if (nameBadge) nameBadge.textContent = val || 'Player';
      //save new names
      localStorage.setItem('plyrNam', val);
    });
  }
  if (distInpt) {
    //Helper function to make sure that the distance is from 1 to 100
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
    // Helper function to make sure thte packages choosen is between 1 and 5
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