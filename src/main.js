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

// If a combatant dies, it should either remove them or just put some sort of indicator
// that they are dead, there should be a button that lets you end combat too


let combatants = [];


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

  let reversedArray = combatants.reverse(); // Reverse the array so people with higher init are at the top

  reversedArray.forEach((combatant) => {
    const card = document.createElement('div');
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

function clearList(){
  const container = document.getElementById('combatant-list-container');
  container.innerHTML = "";
}

function resetCombat(){

  //Maybe we can make a custom one later that is not so jank but this works for now
  let answer = window.confirm("Are you sure?");

  if(answer){
    combatants = [];
    clearList();
  }
}

function resetBoxes(){
  clearInputs()
  document.getElementById('nameBox').focus();
}

function startCombat(){

  // So when you begin combat, it needs to have some sort of indicator who is currently is on, maybe you can turn
  // the card green if it is their turn? or you can have an arrow pointing to whoever it is, I think the green would
  // be a better idea though easier to see
  // so basically every turn it should just go through the list in order turning each card green until it reaches the end
  // once it reaches the end it should go back to the beginning and then increment the rounds, so you also need to make
  // something that keeps track of what round it is
}