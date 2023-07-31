"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

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

    });

    gameBoard.appendChild(newDiv);
  }
}

/** Flip a card face-up. */

let flippedColor = null;
let flippedCount = 0;
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

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(card, color) {

  let clickStatus = false;
  if (card.classList.contains(color)) {
    clickStatus = true;
  };

  if (flippedCount < 2 && clickStatus === false) {

    if (flippedColor === null) {

      flipCard(card, color);
      flippedColor = color;

    } else if (color === flippedColor) {

      flipCard(card, color);
      reset();

    } else if (color !== flippedColor) {

      flipCard(card, color);

      let alreadyFlipped = document.getElementsByClassName(flippedColor);

      setTimeout(() => {
                unFlipCard(card, color);
                unFlipCard(alreadyFlipped[0], flippedColor);
                reset();
              }, 1000)

    };

  };

}
