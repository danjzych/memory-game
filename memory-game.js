"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

let guesses = 0;
let matches = 0;
let playerName = 'Unknown Player';

let bestScore;
let bestName;
if (JSON.parse(localStorage.getItem('bestScore'))) {
  bestScore = JSON.parse(localStorage.getItem('bestScore'));
  bestName = JSON.parse(localStorage.getItem('bestName'));
  document.getElementById('bestScore').innerText = `Best Score: ${bestScore}, ${bestName}`;
}


let colors = shuffle(COLORS);


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

/* Create card for every color in colors (each will appear twice)*/

function createCards(colors, gameBoard) {

  for (let color of colors) {
    const newDiv = document.createElement('div');
    // const hint = document.createElement('p');
    // hint.innerText = color
    // newDiv.appendChild(hint);

    newDiv.addEventListener('click', event => {

      handleCardClick(event.target, color, gameBoard);
      updateGuess();

    });

    gameBoard.appendChild(newDiv);
  }
}


/** Variables to track turn status - color, if a card has been flipped, and number of flips to ensure no more than two cards are flipped */

let flippedColor = null;
let flippedCount = 0;


/** Flip a card face-up. */

function flipCard(card, color) {
  card.className = color;
  flippedCount++;
}


/** Flip a card face-down. */

function unFlipCard(card, color) {
  card.classList.remove(color);
}


/* reset turn */

function reset() {
  flippedColor = null;
  flippedCount = 0;
}


/** Handle clicking on a card. 'guesses' increments with each guess to track score. */

function handleCardClick(card, color, gameBoard) {

  let clickStatus = false;
  if (card.classList.contains(color)) {
    clickStatus = true;
  } else if (flippedCount < 2 && clickStatus === false) {

    if (flippedColor === null) {

      flipCard(card, color);
      flippedColor = color;

    } else if (color === flippedColor) {

      flipCard(card, color);
      reset();
      guesses++;
      matches++;

      handleWin(gameBoard);

    } else if (color !== flippedColor) {

      flipCard(card, color);

      let alreadyFlipped = document.getElementsByClassName(flippedColor);

      setTimeout(() => {
                unFlipCard(card, color);
                unFlipCard(alreadyFlipped[0], flippedColor);
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
      endGame(gameBoard);
      updateBest();
    }, 800);

  };
}

function updateBest() {

  if (guesses < bestScore || !bestScore) {
    bestScore = guesses;
    bestName = playerName;

    localStorage.setItem('bestScore', JSON.stringify(bestScore));
    localStorage.setItem('bestName', JSON.stringify(playerName));
    document.getElementById('bestScore').innerText = `Best Score: ${bestScore}, ${bestName}`;
  }
}


/* Function to "launch game" - Take in player name and difficulty, then hide menu and show gameboard */
function startGame(gameBoard) {

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
  });

}

function endGame(gameBoard) {

  gameBoard.classList.add('hide');
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.lastChild);
  }

  const winScreen = document.querySelector('#winScreen');
  winScreen.classList.remove('hide');

  const playAgainButton = document.querySelector('#playAgain');
  playAgainButton.addEventListener('click', event => {
    winScreen.classList.add('hide');

    const menu = document.querySelector('#menu');
    menu.classList.remove('hide');

    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.lastChild);
    }

    colors = shuffle(COLORS);

    guesses = 0;
    updateGuess();
  })

}

//easy, medium, and hard modes with 4, 10, and 20 cards
//make colors random

document.addEventListener('DOMContentLoaded', () => {

  const gameBoard = document.getElementById("gameContainer");

  startGame(gameBoard);

})