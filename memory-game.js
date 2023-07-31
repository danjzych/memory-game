"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];
let guesses = 0;
let matches = 0;

const colors = shuffle(COLORS);
createCards(colors);


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

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */


function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const newDiv = document.createElement('div');

    newDiv.addEventListener('click', event => {

      handleCardClick(event.target, color);
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

function reset() {
  flippedColor = null;
  flippedCount = 0;
}

/** Handle clicking on a card. 'guesses' increments with each guess to track score. */

function handleCardClick(card, color) {

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

      checkIfWon();

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

function checkIfWon() {
  if (colors.length / 2 === matches) {

    setTimeout(() => {
      window.alert('Congrats, you won');
    }, 800);

  };
}

//if colors.length / 2 === matches, alert user they have won. How to always "watch" this value though?
//While they haven't won, display game, when they do, hide game and show they won?
//startGame function + endGame function?