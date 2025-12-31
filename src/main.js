// I want the combat tracker to basically load up and welcome you to the tracker
// Then it will prompt you to enter all the combatants and I guess each person will
// just have a name/HP/Initiative(Maybe condition as well or speed, but name/HP/Init for sure)
// once you are done entering the name and HP that person will be placed onto the screen
// displaying their information, if a person has a higher initiative then they should
// go at the top, when you enter another character it should know where it goes within
// the other combatants, then it will allow you to start combat, so it should start at
// the first person, you should be able to change their hp and condition or whatever
// then when that turn is over it should highlight or have an arrow pointing towards the next
// person, once it reaches the last person, it should loop around to the first person again


//TODO:
// 1. Indicator for a dead combatant, maybe a slash, I think that maybe when their health goes below zero their card can
// become red and then there should be an option to remove them as well, so have a button you can click where you can remove
// the person from the list and re render
// 2. A way to use the index feature to edit certain fields that you might have missed so you do not need to clear the entire
// list again, or maybe its better to just add the remove feature then you can create a new combatant instead of edit one?


// Need to design a function that will take in the index of a card as well as the damage taken, then it can subtract
// this amount from whatever box you click on, so in the for loop when you create the cards, you need to also
// give it some sort of index that can be assigned and this will make it easier later to keep track of what card to
// subtract the health from when you want someone to take damage, MAYBE LOOK UP SOMETHING ABOUT DATASET ATTRIBUTES OR WHATEVER


let combatants = [];
let combat = false;
let currentIndex = 0;
let currentRound = 1;
let userConfirm = false;


function openModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'flex';
  document.getElementById('nameBox').focus();
}

function clearInputs() {
  document.getElementById('nameBox').value = "";
  document.getElementById('initiativeBox').value = "";
  document.getElementById('hpBox').value = "";
  document.getElementById('acBox').value = "";
}

function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
  clearInputs()
}

function addCombatant(){
  const nameBox = document.getElementById('nameBox');
  const initiativeBox = document.getElementById('initiativeBox');
  const hpBox = document.getElementById('hpBox');
  const acBox = document.getElementById('acBox');

  let name = nameBox.value;
  let initiative = Number(initiativeBox.value);
  let hp = Number(hpBox.value);
  let ac = Number(acBox.value);

  let nameCheck = name.trim();

  //Maybe could check to make sure that the init,hp, and AC are numbers as well?
  if (nameCheck === ""){
    alert("Please enter a name");
  } else{
    const person = {
      name : name,
      initiative : initiative,
      maxHp : hp,
      currentHp : hp,
      ac : ac,
    }

    combatants.push(person);
    combatants.sort((a,b) => b.initiative - a.initiative);
    // By doing b.init minus a.init it sorts backwards, so highest init is first in list
    renderList();

    resetBoxes();
  }
}

function renderList(){
  const container = document.getElementById('combatant-list-container');
  container.innerHTML = "";

  combatants.forEach((combatant, index) => {

    const card = document.createElement('div');
    const infoBox = document.createElement('div');
    const buttonBox = document.createElement('div');

    card.dataset.index = index; //MAKE SURE THIS CONVERTS FROM NUMBER TO STRING PROPERLY, JS SHOULD HANDLE IT??

    card.className = 'combatant-card'; /* This assigns it to the CSS class so it knows how to style it*/
    infoBox.className = 'info-box';
    infoBox.innerHTML = `
        <strong>${combatant.name}:</strong>
        <span>Initiative: ${combatant.initiative}</span>
        <span>HP: ${combatant.currentHp} / ${combatant.maxHp}</span>
        <span>Ac: ${combatant.ac}</span>
    `;

    const damageButton = document.createElement('button');
    damageButton.className = 'damage-button';
    damageButton.textContent = '-';
    damageButton.style.display = 'flex'

    const healthButton = document.createElement('button');
    healthButton.className = 'health-button';
    healthButton.textContent = '+';
    healthButton.style.display = 'flex'

    // THIS IS THE INPUT BOX IN EVERY CARD FOR HEALTH
    const inputBox = document.createElement('input');
    inputBox.placeholder = "Hp"
    inputBox.className = 'input-box';
    inputBox.type = 'number';
    inputBox.style.display = 'flex';
    inputBox.id = 'hp-input-' + index;


    damageButton.addEventListener('click', () => takeDamage(index));
    healthButton.addEventListener('click', () => heal(index));


    buttonBox.appendChild(healthButton);
    buttonBox.appendChild(inputBox);
    buttonBox.appendChild(damageButton);
    card.appendChild(infoBox);
    card.appendChild(buttonBox);
    container.appendChild(card);
  })
}

function wipeList(){
  const container = document.getElementById('combatant-list-container');
  const roundContainer = document.getElementById('round-container');
  container.innerHTML = "";
  roundContainer.innerHTML = '';
}

function clearList(){

  const container = document.getElementById('combatant-list-container');
  const childCount = container.childElementCount;
  if (childCount === 0) {
    alert('There is no list to clear.');
  } else {

    let answer = confirm('Are you sure?');

    if (answer) {
      userConfirm = true;
      combatants = [];
      wipeList();
    }
  }
}

function resetBoxes(){
  clearInputs()
  document.getElementById('nameBox').focus();
}

function startCombat(){
  // Check if there is 1 person or less, if there is then you cannot have combat with 1 person
  // Highlight the first card green, so loop through the combatants reversed list and highlight green then
  // undo the highlight when the user goes to the next person
  // Add the rounds tracker at the top of the screen
  // Add an end combat button when you start combat

  const container = document.getElementById('combatant-list-container');
  const header = document.getElementById('header');
  const childCount = container.childElementCount;
  if (childCount < 2){
    alert("You must add at least 2 combatants before combat can start");
  }else{
    combat = true;

    const roundContainer = document.createElement('div');
    roundContainer.id = 'round-container';

    roundContainer.style.position = 'absolute';
    roundContainer.style.textAlign = 'center';
    roundContainer.style.marginLeft = '25%';
    roundContainer.style.marginTop = '6%'
    roundContainer.style.fontSize = '250%';
    roundContainer.style.font = 'bold';

    roundContainer.textContent = 'Round: ';

    //document.body.insertBefore(roundContainer, document.body.firstChild);
    header.prepend(roundContainer);
    roundContainer.textContent += currentRound;

    revealButton('endCombatButton');
    revealButton('nextButton');
    revealButton("previousButton");

    const firstElement = container.firstElementChild;
    firstElement.style.backgroundColor = 'rgba(0,255,0,0.4)';
  }

}

//Currently being used for the clearList button and the endCombat button, should we even keep the clearList button?
function endCombat(){
    clearList();

    if (userConfirm){
      combat = false;
      hideButton("endCombatButton");
      hideButton("nextButton");
      hideButton("previousButton");
    }

    userConfirm = false;
}

function nextCombat(){

  const container = document.getElementById('combatant-list-container');
  const roundContainer = document.getElementById('round-container');
  const totalCombatants = container.children.length;

  const oldIndex = currentIndex; // Set the old index equal to current then increment current

  currentIndex++;

  if (currentIndex >= totalCombatants){
    currentIndex = 0;
    currentRound++;
    roundContainer.textContent = 'Round: ' + currentRound;
  }

  updateCombatantColor(oldIndex, currentIndex);
  currentIndex.scrollIntoView();

}

function prevCombat(){

  const container = document.getElementById('combatant-list-container');
  const roundContainer = document.getElementById('round-container');
  const totalCombatants = container.children.length;

  const oldIndex = currentIndex;

  currentIndex--;

  if (currentIndex < 0){
    currentIndex = totalCombatants - 1;
    if (currentRound > 1){
      currentRound--;
      roundContainer.textContent = 'Round: ' + currentRound;
    }
  }

  updateCombatantColor(oldIndex, currentIndex);
}

function updateCombatantColor(oldIndex, newIndex){

  const container = document.getElementById('combatant-list-container');
  const childElements = container.children;
  const activeElement = childElements[newIndex];

  childElements[oldIndex].style.backgroundColor = 'rgba(0,0,0,0)';
  childElements[newIndex].style.backgroundColor = 'rgba(0,255,0,0.4)';

  activeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

function updateCurrentColor(){

  const container = document.getElementById('combatant-list-container');
  const childElements = container.children;

  childElements[currentIndex].style.backgroundColor = 'rgba(0,255,0,0.4)';
}

function revealButton(button){
  const but = document.getElementById(button);
  if(but){
    but.hidden = false;
  }
}

function hideButton(button){
  const but = document.getElementById(button);
  if(but){
    but.hidden = true;
  }
}

function takeDamage(index){

  // Need to add it so that when they cannot go below 0 hp, and also add an option to show they are dead, maybe some sort of skull?

  const input = document.getElementById('hp-input-' + index);
  combatants[index].currentHp = combatants[index].currentHp - Number(input.value);
  renderList();
  updateCurrentColor();
}

function heal(index){

  //Need to add a way for it to not go over the max HP, but what if they are given a spell or something that increases max hp?
  const input = document.getElementById('hp-input-' + index);
  combatants[index].currentHp = combatants[index].currentHp + Number(input.value);
  renderList();
  updateCurrentColor();

}
