// Global variables for each element
const screen = document.querySelector('.boundingbox');
const zoomButton = document.querySelector('.button4');
const listDiv = document.querySelector('.list-div');
const dpadUp = document.querySelector('.up');
const dpadDown = document.querySelector('.down');
const slider = document.querySelector('.scroll');
const display = document.querySelector('.screen');

// Tracks the count in the list of pokemon
const GlobalCountObject = new function() {
    let count = 0;
    this.adjustCount = (amount) => {
        
        (amount > 1) ? count = amount : (count + amount) > 150 ? count = 150 : (count + amount < 0) ? count = 0 : count += amount;
        // if ((count == 150 && amount == 1) || (count == 0 && amount == -1)) {
        //     return;
        // } 
        // else {
        //     return (amount == 1) ? count += amount : (amount == -1) ? count += amount : count = amount - 1;
        // }
    };
    this.getCount = () => {
        return count;
    };
}

// Initialise the zoom to zero.
let zoom = false;

// Initialise the slider at 1;
slider.value = 1;

// Array that stores objects for each pokemon and their properties
const pokedex =[];
const divOffset = getComputedStyle(document.querySelector(':root')).getPropertyValue('--image-list-offset');
const divListInitialOffset = formatOffsetValue(divOffset);

// Fetch the data from the resource hosted on the network and store it in the pokedex array
fetch('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
.then(response => response.json())
.then(data => {
    pokedex.push(...data.pokemon)
    console.log(pokedex);
    populateData();
    console.log(listDiv.children);
    const previousName = listDiv.children[0].children[1];
    previousName.classList.add('selected-name');
});

function populateData() {
        
    pokedex.forEach(element => {
        let pokemonElement = document.createElement('div');
                
        // Extract and format the name and number data
        const numString = removeZeroes(element.num);
        const nameString = removeNidoranDescrition(element.name); 
        let dataString = `No. ${numString} - ${nameString}`;
                
        // Extract and append the image files to the screen.
        pokemonElement.innerHTML = `<img class="pokemon-image" src="${element.img}"><span class='pokemon'>${dataString}</span>`;
        pokemonElement.classList.add('pokemon-div');
        listDiv.appendChild(pokemonElement);
    })
}

function formatOffsetValue(offsetString) {
    const regex = /px/g;
    const numeric = offsetString.replace(regex, '');
    return numeric;
}

function removeNidoranDescrition(name) {
    const regex = /\s\(Male\)|\s\(Female\)/g;
    const newName = name.replace(regex, '');
    return newName;
}

function removeZeroes(string) {
    const regex = /^[0]+/g;
    const newString = string.replace(regex,'');
    return newString;
}

function formatDisplayedName(currentCount, e) {
    const buttonPushed = e.target.classList[0];
    let previousName;
    buttonPushed =='down' ? previousName = listDiv.children[currentCount - 1].children[1] : previousName = listDiv.children[currentCount + 1].children[1];
    previousName.classList.remove('selected-name');
    
    const displayedName = listDiv.children[currentCount].children[1];
    displayedName.classList.add('selected-name');
}

function formatScrollName(currentCount, previousCount) {
    const displayedName = listDiv.children[currentCount].children[1];
    const previousName = listDiv.children[previousCount].children[1];
    previousName.classList.remove('selected-name');    
    displayedName.classList.add('selected-name');
}

function scrollListUp(event) {
    if (GlobalCountObject.getCount() == 0) {
        return 
    }
    GlobalCountObject.adjustCount(-1);
    slider.value = GlobalCountObject.getCount();
    console.log(GlobalCountObject.getCount())
    formatDisplayedName(GlobalCountObject.getCount(), event);
    listDiv.style.transform = `translateY(${divListInitialOffset - GlobalCountObject.getCount() * 50}px)`;
    updateBackground(GlobalCountObject.getCount());
}

function scrollListDown(event) {
    GlobalCountObject.adjustCount(1);
    slider.value = GlobalCountObject.getCount();
    console.log(GlobalCountObject.getCount())
    formatDisplayedName(GlobalCountObject.getCount(), event);
    listDiv.style.transform = `translateY(${divListInitialOffset - GlobalCountObject.getCount() * 50}px)`;
    updateBackground(GlobalCountObject.getCount());
}

function manualScroll(event) {
    const beforeCount = GlobalCountObject.getCount();
    GlobalCountObject.adjustCount(slider.value - 1);
    console.log(GlobalCountObject.getCount(), beforeCount); 
    formatScrollName(GlobalCountObject.getCount(), beforeCount);
    listDiv.style.transform = `translateY(${divListInitialOffset - GlobalCountObject.getCount() * 50}px`;
    updateBackground(GlobalCountObject.getCount());
}

function updateBackground(count) {
    const typeArray = pokedex[count].type;
    const mainType = typeArray[0];

    if (typeArray.length == 2 && mainType == 'Normal' && typeArray[1] == 'Flying') {
        display.style.backgroundImage = 'url("images/flying.jpeg")';
    }
    else {
        switch (mainType) {
            case 'Grass':
                display.style.backgroundImage = 'url("images/grass.jpeg")';
                break;
            case 'Water':
                display.style.backgroundImage = 'url("images/water.jpeg")';
                break;
            case 'Fire':
                display.style.backgroundImage = 'url("images/fire.jpeg")';
                break;
            case 'Bug':
                display.style.backgroundImage = 'url("images/bug.jpg")';
                break;
            case 'Electric':
                display.style.backgroundImage = 'url("images/electric.jpeg")';
                break;
            case 'Fighting':
                display.style.backgroundImage = 'url("images/fighting.jpeg")';
                break;
            case 'Flying':
                display.style.backgroundImage = 'url("images/flying.jpeg")';
                break;
            case 'Ghost':
                display.style.backgroundImage = 'url("images/ghost.jpeg")';
                break;
            case 'Ground':
                display.style.backgroundImage = 'url("images/ground.jpeg")';
                break;
            case 'Normal':
                display.style.backgroundImage = 'url("images/normal.jpg")';
                break;
            case 'Poison':
                display.style.backgroundImage = 'url("images/poison.jpeg")';
                break;
            case 'Psychic':
                display.style.backgroundImage = 'url("images/psychic.jpeg")';
                break;
            case 'Ice':
                display.style.backgroundImage = 'url("images/ice.jpeg")';
                break;
            case 'Dragon':
                display.style.backgroundImage = 'url("images/dragon.jpeg")';
                break;
            default:
                display.style.backgroundImage = 'url("images/normal.jpg")';
        }
    }
}

function zoomScreen() {
    if (zoom == false) {
        screen.style.zoom = 2;
        window.scrollTo(400, 600);
        zoom = true;
    }
    else {
        screen.style.zoom = 1;
        window.scrollTo(0, 0);
        zoom = false;
    }
    
}

zoomButton.addEventListener('mousedown', zoomScreen);
dpadDown.addEventListener('mousedown', scrollListDown);
dpadUp.addEventListener('mousedown', scrollListUp);
slider.addEventListener('mousemove', manualScroll);

//data to extract .id, .name, .type (array), 