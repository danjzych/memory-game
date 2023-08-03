bestScores = {
  'easy': {
    'name': null,
    'score': null
  },
  'medium': {
    'name': null,
    'score': null
  },
  'hard': {
    'name': null,
    'score': null
  },
}
let currentScore;
let currentDifficulty;

//create a currentScore variable to hold currentScore
//difficulty becomes currentDifficulty in the global namespace
//if statement still checks for best score
//update best function refactor, checks bestScore object and makes any updates based on it
//checkScore function to see if current score is better than previous best. If so, update bestScore object, reset bestScore in local storage
//and update page

function checkScore() {

  //check best score for current difficulty only

}

function updateBest() {

  //if there is a best score, udpate it. If not, leave defauult inner text. This function should be agnostic as to wherther there is a
  //new best score, and simply update
  //check score function will check current game for a bestScore and update, call updateBest after to update
  // for (const difficulty in bestScores) {
  //   if (difficulty === currentDifficulty && difficulty.score !== null) {
  //     bestScores.difficulty.score =
  //   }
  // }

  if (guesses < bestScore || !bestScore) {
    bestScore = guesses;
    bestName = playerName;

    localStorage.setItem('bestScore', JSON.stringify(bestScore));
    localStorage.setItem('bestName', JSON.stringify(playerName));
    document.getElementById('bestScore').innerText = `Best Score: ${bestScore}, ${bestName}`;
  }
};

