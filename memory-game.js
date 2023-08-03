"use strict";

///////////////////////////////////
//// SET STORAGE AND VARIABLES ////
///////////////////////////////////
let colors = [];

let guesses = 0;
let matches = 0;
let playerName = 'Unknown Player';

let bestScores = {
'Easy': {
    'name': null,
    'score': null
  },
  'Medium': {
    'name': null,
    'score': null
  },
  'Hard': {
    'name': null,
    'score': null
  },
}
if (JSON.parse(localStorage.getItem('bestScores'))) {
  bestScores = JSON.parse(localStorage.getItem('bestScores'));
  updateBest()
};

let currentDifficulty;


///////////////////////////////////
////////// BUILD BOARD ////////////
///////////////////////////////////

/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

//generate RGB colors of varying dissimilarity based on difficulty
function createColorList() {

  while (colors.length < 12) {

    let color;
    if (currentDifficulty === 'Easy') {
      color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
    } else if (currentDifficulty === 'Medium') {
      color = `rgba(184, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
    } else if (currentDifficulty === 'Hard') {
      color = `rgba(0, ${Math.floor(Math.random() * 255)}, 71, 0.7)`;
    }

    if (!colors.includes(color)) {
      colors.push(color);
      colors.push(color);
    };

  };

}

/* Create card for every color in colors (each will appear twice)*/
function createCards(colors, gameBoard) {

  createColorList();

  colors = shuffle(colors);

  for (let color of colors) {
    const newDiv = document.createElement('div');
    console.log('test')

    newDiv.addEventListener('click', event => {

      handleCardClick(event.target, color, gameBoard);
      updateGuess();

    });

    gameBoard.appendChild(newDiv);
  }
}


///////////////////////////////////
////////// PLAYING GAME ///////////
///////////////////////////////////

/** Variables to track turn status - color, if a card has been flipped, and number of flips to ensure no more than two cards are flipped */
let flippedColor = null;
let flippedCount = 0;
let firstFlip = null;


/** Flip a card face-up. */
function flipCard(card, color) {
  card.style.backgroundColor = color;
  flippedCount++;
}


/** Flip a card face-down. */
function unFlipCard(card) {
  card.removeAttribute('style');
}


/* reset turn */
function reset() {
  flippedColor = null;
  flippedCount = 0;
  firstFlip = null;
}


/** Handle clicking on a card. 'guesses' increments with each guess to track score. */
function handleCardClick(card, color, gameBoard) {

  let clickStatus = false;
  if (card.style.backgroundColor === color) {
    clickStatus = true;
  } else if (flippedCount < 2 && clickStatus === false) {

    if (flippedColor === null) {

      flipCard(card, color);
      flippedColor = color;
      firstFlip = card;

    } else if (color === flippedColor) {

      flipCard(card, color);
      reset();
      guesses++;
      matches++;

      handleWin(gameBoard);

    } else if (color !== flippedColor) {

      flipCard(card, color);

      setTimeout(() => {
                unFlipCard(card);
                unFlipCard(firstFlip);
                reset();
              }, 1000);
      guesses++;

    };

  };

}


function updateGuess() {
  document.querySelector('#guessDisplay').innerText = `Guesses: ${guesses}`;
}

function handleWin(gameBoard) {
  if (colors.length / 2 === matches) {

    setTimeout(() => {
      checkScore();
      updateBest();
      endGame(gameBoard);
    }, 800);

  };
}


//if current score is better than previous best score for this difficulty, update bestScore object in local storage
function checkScore() {

  if (guesses < bestScores[currentDifficulty].score || bestScores[currentDifficulty].score === null) {
    bestScores[currentDifficulty].score = guesses;
    bestScores[currentDifficulty].name = playerName;

    localStorage.setItem('bestScores', JSON.stringify(bestScores));
  };

}


//if there is a best score, udpate it. If not, leave defauult inner text.
function updateBest() {

  for (const difficulty in bestScores) {
    if (bestScores[difficulty].score !== null) {
      document.getElementById(difficulty).innerText = `Best ${difficulty} Score: ${bestScores[difficulty].score}, ${bestScores[difficulty].name}`;
    };
  };

}


/* Function to "launch game" - Take in player name and difficulty, then hide menu and show gameboard */
function startGame(gameBoard) {

  //add event listeners to difficulty buttons if they haven't been added already
  if (currentDifficulty === undefined) {
    document.querySelectorAll('input[name="difficulty"]').forEach(button => {
      button.addEventListener('click', () => {
        currentDifficulty = button.value;
      });
    });
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', event => {

    const nameInput = document.querySelector('#nameInput').value;
    if (nameInput) {
      playerName = nameInput;
      document.querySelector('#playerName').innerText = playerName;
    };

    event.preventDefault();

    const menu = document.querySelector('#menu');
    menu.classList.add('hide');

    gameBoard.classList.remove('hide');

    createCards(colors, gameBoard);
  }, {once: true});

}

function endGame(gameBoard) {

  gameBoard.classList.add('hide');
  gameBoard.innerHTML = '';

  const winScreen = document.querySelector('#winScreen');
  winScreen.classList.remove('hide');


  const scoreReport = document.querySelector('.scoreReport');
  if (guesses <= bestScores[currentDifficulty].score) {
    scoreReport.innerText = 'You set the new best score for this difficulty - awesome!'
  } else {
    scoreReport.innerHTML = 'Unfortunately, you haven\'t beaten the best score...' + '<br>' + 'what a shame.';
  }

  const playAgainButton = document.querySelector('#playAgain');
  playAgainButton.addEventListener('click', event => {
    winScreen.classList.add('hide');

    const menu = document.querySelector('#menu');
    menu.classList.remove('hide');

    colors = [];

    guesses = 0;
    updateGuess();
    matches = 0;

    window.location.reload();
  })

}


/* let's play the game! */
document.addEventListener('DOMContentLoaded', () => {

  const gameBoard = document.getElementById("gameContainer");

  startGame(gameBoard);

})