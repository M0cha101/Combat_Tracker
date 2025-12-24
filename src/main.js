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
// 1. Indicator for a dead combatant, maybe a slash
// 2. Way to move to the next person in combat, needs to loop around too and increment round number
// 3. Need to create something attached to the card where you can enter how much damage is dealt to them or just make the
// HP they have editable or something, or make a box for damage dealt and health given maybe, so when you put a number into either box it will
// either add the health or subtract the health


// Need to design a function that will take in the index of a card as well as the damage taken, then it can subtract
// this amount from whatever box you click on, so in the for loop when you create the cards, you need to also
// give it some sort of index that can be assigned and this will make it easier later to keep track of what card to
// subtract the health from when you want someone to take damage, MAYBE LOOK UP SOMETHING ABOUT DATASET ATTRIBUTES OR WHATEVER


let combatants = [];
let reversedArray = [];
let combat = false;
let numberToAppend;
let nextElement = 1;
let previousElement;
let cardIndex = 0;

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


/*
   * Grab Data -> Create Object -> Add to List -> Sort -> Re-render.
*/
function addCombatant(){
  const nameBox = document.getElementById('nameBox');
  const initiativeBox = document.getElementById('initiativeBox');
  const hpBox = document.getElementById('hpBox');
  const acBox = document.getElementById('acBox');

  let name = nameBox.value;
  let initiative = initiativeBox.value;
  let hp = hpBox.value;
  let ac = acBox.value;

  let nameCheck = name.trim();

  //Maybe could check to make sure that the init,hp, and AC are numbers as well?
  if (nameCheck === ""){
    alert("Please enter a name");
  } else{
    const person = {
      name : name,
      initiative : initiative,
      hp : hp,
      ac : ac,
    }

    combatants.push(person);
    combatants.sort((a,b) => a.initiative - b.initiative);
    renderList();

    resetBoxes();
  }
}

function renderList(){
  const container = document.getElementById('combatant-list-container');
  container.innerHTML = "";

  reversedArray = combatants.reverse(); // Reverse the array so people with higher init are at the top

  reversedArray.forEach((combatant) => {
    const card = document.createElement('div');
    card.dataset.index = cardIndex; //MAKE SURE THIS CONVERTS FROM NUMBER TO STRING PROPERLY, JS SHOULD HANDLE IT??

    card.className = 'combatant-card'; /* This assigns it to the CSS class so it knows how to style it*/
    card.innerHTML = `
        <strong>${combatant.name}:</strong>
        <span>Initiative: ${combatant.initiative}</span>
        <span>HP: ${combatant.hp}</span>
        <span>Ac: ${combatant.ac}</span>
    `;

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
    //Maybe we can make a custom one later that is not so jank but this works for now
    let answer = window.confirm('Are you sure?');

    if (answer) {
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
  const childCount = container.childElementCount;
  if (childCount < 2){
    alert("You must add at least 2 combatants before combat can start");
  }else{
    combat = true;

    const roundContainer = document.createElement('div');
    numberToAppend = 1;
    roundContainer.id = 'round-container';

    roundContainer.style.position = 'absolute';
    roundContainer.style.textAlign = 'center';
    roundContainer.style.marginLeft = '45%';
    roundContainer.style.fontSize = '250%';
    roundContainer.style.font = 'bold';

    roundContainer.textContent = 'Round: ';

    document.body.insertBefore(roundContainer, document.body.firstChild);
    roundContainer.textContent += numberToAppend;

    revealButton('endCombatButton');
    revealButton('nextButton');

    const firstElement = container.firstElementChild;
    firstElement.style.backgroundColor = 'rgba(0,255,0,0.4)';
  }

}

function endCombat(){

  let answer = window.confirm('Are you sure?');
  if(answer){
    wipeList()
    combat = false;
    hideButton("endCombatButton");
    hideButton("nextButton");
    //NEED TO ADD MORE TO THIS LATER THIS JUST ASKS IF YOU ARE SURE RIGHT NOW
  }


}

function nextCombat(){

  // so while the boolean combat is true, we need to highlight the next combatant in the html to green
  // when it reaches the end of the loop it needs to increase the round number and then reset the loop back to the beginning
  // basically the only thing this function does is highlight whoever's turn it is then go back to the beginning when it reaches
  // the end

  const container = document.getElementById('combatant-list-container')
  const roundContainer = document.getElementById('round-container');
  const childElements = container.children;

  previousElement = nextElement -1;

  childElements[nextElement].style.backgroundColor = 'rgba(0,255,0,0.4)';
  if(previousElement >= 0){
    childElements[previousElement].style.backgroundColor = 'rgba(0,0,0,0)';
  }else{
    childElements[childElements.length - 1].style.backgroundColor = 'rgba(0,0,0,0)';
  }
  nextElement++;

  if(nextElement === childElements.length){
    nextElement = 0;
  }
  if(nextElement === 1){
    numberToAppend++;
    roundContainer.textContent = "Round: " + numberToAppend;
  }
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
