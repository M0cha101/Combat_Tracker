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

  if(ac === 0){
    ac = '';
  }
  if(hp === 0){
    hp = '';
  }

  let nameCheck = name.trim();

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
    updateCurrentColor();
  }
}

function renderList(){
  const container = document.getElementById('combatant-list-container');
  container.innerHTML = "";

  combatants.forEach((combatant, index) => {

    const card = document.createElement('div');
    const infoBox = document.createElement('div');
    const buttonBox = document.createElement('div');

    card.dataset.index = index;

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

    const inputBox = document.createElement('input');
    inputBox.placeholder = "Hp"
    inputBox.className = 'input-box';
    inputBox.type = 'number';
    inputBox.style.display = 'flex';
    inputBox.id = 'hp-input-' + index;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.style.display = 'flex';
    deleteButton.style.marginLeft = '15px';
    deleteButton.style.marginTop = '15px';

    const dead = document.createElement('div');
    dead.id = 'dead-' + index;
    dead.className = 'dead';
    dead.textContent = 'DEAD';
    dead.style.display = 'inline-block';
    dead.style.marginTop = '25px';
    dead.style.flexDirection = 'column';
    dead.style.fontSize = '40px';
    dead.style.bold = true;
    dead.style.color = 'red';

    if (combatant.currentHp === '' || combatant.currentHp > 0){
      dead.style.visibility = 'hidden';
    }



    damageButton.addEventListener('click', () => takeDamage(index));
    healthButton.addEventListener('click', () => heal(index));
    deleteButton.addEventListener('click', () => deleteCard(index));


    buttonBox.appendChild(healthButton);
    buttonBox.appendChild(inputBox);
    buttonBox.appendChild(damageButton);
    buttonBox.appendChild(deleteButton);

    infoBox.appendChild(dead);

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
      userConfirm = true; //Needed?
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

    header.prepend(roundContainer);
    roundContainer.textContent += currentRound;

    revealButton('endCombatButton');
    revealButton('nextButton');
    revealButton("previousButton");

    const firstElement = container.firstElementChild;
    firstElement.style.backgroundColor = 'rgba(0,255,0,0.4)';
  }

}

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

  const oldIndex = currentIndex;

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

  if(currentRound === 1 && currentIndex === 0){
    alert("You cannot go back any further.")
    return;
  }

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

function revealDead(index){

  const deadElement = document.getElementById(`dead-${index}`);
  if(deadElement){
    deadElement.style.visibility = 'visible';
  }
}

function hideDead(index){
  const deadElement = document.getElementById(`dead-${index}`);
  if(deadElement){
    deadElement.style.visibility = 'hidden';
  }
}

function hideButton(button){
  const but = document.getElementById(button);
  if(but){
    but.hidden = true;
  }
}

function takeDamage(index){

  if(!combat){
    alert("You cannot take damage outside of combat.")
    return;
  }

  const input = document.getElementById('hp-input-' + index);
  let newHp = combatants[index].currentHp - Number(input.value);

  if (newHp < 0){
    combatants[index].currentHp = 0;
  }else{
    combatants[index].currentHp = newHp;
  }
  renderList();
  updateCurrentColor();

  if (Number(combatants[index].currentHp) <= 0){
    revealDead(index);
  }

}

function heal(index){

  if (!combat) {
    alert('You cannot heal outside of combat.');
    return;
  }

  const input = document.getElementById('hp-input-' + index);
  combatants[index].currentHp = combatants[index].currentHp + Number(input.value);
  renderList();
  updateCurrentColor();

  if (combatants[index].currentHp > 0){
    hideDead(index);
  }

}

function deleteCard(index){

  let answer = confirm('Are you sure?');

  if(answer){
    combatants.splice(index, 1);
    renderList();
  }

}
