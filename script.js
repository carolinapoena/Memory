const board = document.getElementById('game-board');

const timerDisplay = document.getElementById('timer');

// Create and insert Next Level button
let nextBtn = document.createElement('button');
nextBtn.id = 'next-level';
nextBtn.textContent = 'Next Level';
nextBtn.style.display = 'none';
nextBtn.style.marginTop = '16px';
nextBtn.addEventListener('click', () => {
  level++;
  updateLevelLabel();
  createBoard();
  nextBtn.style.display = 'none';
});
document.querySelector('.next-container')?.appendChild(nextBtn);

// Create and insert Restart Game button
let restartGameBtn = document.createElement('button');
restartGameBtn.id = 'restart-game';
restartGameBtn.textContent = 'Restart Game';
restartGameBtn.style.marginLeft = '12px';
restartGameBtn.addEventListener('click', () => {
  level = 1;
  resetGame();
  updateLevelLabel();
  nextBtn.style.display = 'none';
});
document.querySelector('.container')?.appendChild(restartGameBtn);

// Each card has a unique cardId, and a pairId for matching (pairId never in DOM)
const basePairs = [
  { pairId: 1, seo: 'Yoast AI' },
  { pairId: 1, seo: "<img src=\'./yoast_ai.png\'>" },
  { pairId: 2, seo: 'Readability' },
  { pairId: 2, seo: '<img src="./readability.png">' },
  { pairId: 3, seo: 'Internal linking' },
  { pairId: 3, seo: '<img src="./internal_linking.png">' },
  { pairId: 4, seo: '24/7 support' },
  { pairId: 4, seo: '<img src="./support.png">' },
  { pairId: 5, seo: 'Google docs add-on' },
  { pairId: 5, seo: '<img src="./google_docs.png">' },
  { pairId: 6, seo: 'Yoast SEO for Shopify' },
  { pairId: 6, seo: '<img src="./shopify.png">' },
  { pairId: 7, seo: 'Social previews' },
  { pairId: 7, seo: '<img src="./facebook.png">' },
  { pairId: 8, seo: 'Yoast Academy' },
  { pairId: 8, seo: '<img src="./academy.png">' }
];

let cardsData = [];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let startTime = null;
let timerInterval = null;
let level = 1;
let maxPairs = Math.floor(basePairs.length / 2);

let score = 0;
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score';
scoreDisplay.textContent = 'Score: 0';
scoreDisplay.style.marginTop = '12px';
document.querySelector('.container')?.appendChild(scoreDisplay);

const leaderboard = document.createElement('div');
leaderboard.id = 'leaderboard';
leaderboard.innerHTML = '<h3>Leaderboard</h3><ol id="leaderboard-list"></ol>';
leaderboard.style.marginTop = '16px';
document.querySelector('.container')?.appendChild(leaderboard);

let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let cardList = [];
function createBoard() {
  // Determine number of pairs for this level
  let numPairs = Math.min(2 + (level - 1) * 2, maxPairs); // Start with 2 pairs (4 cards) and add 2 pairs (4 cards) per level
  let pairsForLevel = [];
  let usedPairIds = new Set();
  for (let i = 0; i < basePairs.length && pairsForLevel.length < numPairs * 2; i++) {
    if (!usedPairIds.has(basePairs[i].pairId)) {
      // Find both cards for this pairId
      let pairCards = basePairs.filter(p => p.pairId === basePairs[i].pairId);
      pairsForLevel.push(...pairCards);
      usedPairIds.add(basePairs[i].pairId);
    }
  }
  cardsData = pairsForLevel.map((c) => ({
    pairId: c.pairId,
    seo: c.seo
  }));
  cardList = shuffle([...cardsData]);
  board.innerHTML = '';
  cards = [];
  matchedCount = 0;
  flippedCards = [];
  cardList.forEach((cardInfo, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = idx;
    // Remove this for the real game.
    card.innerHTML = cardInfo.pairId;
    card.addEventListener('click', onCardClick);
    board.appendChild(card);
    cards.push(card);
  });
}

function onCardClick(e) {
  const card = e.currentTarget;
  if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) return;

  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
  }

  card.classList.add('flipped');
  // Get the phrase from the shuffled cardList using the index
  const idx = parseInt(card.dataset.index, 10);
  card.innerHTML = cardList[idx].seo;
  console.log( cardList[idx].seo );
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;
    const idx1 = parseInt(card1.dataset.index, 10);
    const idx2 = parseInt(card2.dataset.index, 10);
    if (cardList[idx1].pairId === cardList[idx2].pairId) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedCount += 2;
      flippedCards = [];
      updateScore(10); // Award points for a match
      // All cards matched for this level
      if (matchedCount === cardList.length) {
        updateTimer();
        setTimeout(() => {
          alert(`Congratulations! You finished level ${level} in ${getElapsedSeconds()} seconds.`);
          updateLeaderboard();
          // Only show next button if more levels are possible
          if (Math.pow(2, level) <= maxPairs * 2) {
            nextBtn.style.display = 'inline-block';
          }
        }, 300);
      }
    } else {
      updateScore(-5); // Deduct points for a mismatch
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.innerHTML = '';
        card2.innerHTML = '';
        flippedCards = [];
      }, 900);
    }
  }
}

function updateTimer() {
  timerDisplay.textContent = `Time: ${getElapsedSeconds()}s`;
}

function getElapsedSeconds() {
  if (!startTime) return 0;
  return Math.floor((Date.now() - startTime) / 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  startTime = null;
  timerDisplay.textContent = 'Time: 0s';
  score = 0;
  updateScore(0); // Reset score display
  createBoard();
}

function updateScore(points) {
  score += points;
  scoreDisplay.textContent = `Score: ${score}`;
}

// Create and insert Level Label
const levelLabel = document.createElement('div');
levelLabel.id = 'level-label';
levelLabel.textContent = `Level: ${level}`;
levelLabel.style.fontSize = '1.2em';
levelLabel.style.marginBottom = '8px';
levelLabel.style.fontWeight = 'bold';
document.querySelector('.container')?.insertBefore(levelLabel, timerDisplay);

// Update the level label when the level changes
function updateLevelLabel() {
  levelLabel.textContent = `Level: ${level}`;
}


// Create a form for player's name input
const nameForm = document.createElement('form');
nameForm.id = 'name-form';
nameForm.innerHTML = `
  <label for="player-name">Enter your name to start the game:</label>
  <input type="text" id="player-name" placeholder="Your name" required>
  <button type="submit">Start</button>
`;
nameForm.style.marginBottom = '16px';
document.querySelector('.container')?.prepend(nameForm);

let playerName = "Player"; // Default name if none is provided

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('player-name');
  if (nameInput.value.trim()) {
    playerName = nameInput.value.trim();
  }
  nameForm.style.display = 'none'; // Hide the form after submission
  gameTitle.style.display = 'none'; // Hide the game title after submission
  board.style.display = 'grid';
  timerDisplay.style.display = 'block';
  levelLabel.style.display = 'block';
  restartGameBtn.style.display = 'inline-block';
  scoreDisplay.style.display = 'block';
  leaderboard.style.display = 'block';
  createBoard();
  updateLeaderboard();
});

// Update leaderboard to include player's name
function updateLeaderboard() {
  leaderboardData.push({ name: playerName, level, score, time: getElapsedSeconds() });
  leaderboardData.sort((a, b) => b.score - a.score || a.time - b.time);
  leaderboardData = leaderboardData.slice(0, 5); // Keep top 5 scores
  localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

  const leaderboardList = document.getElementById('leaderboard-list');
  leaderboardList.innerHTML = '';
  leaderboardData.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} - Level ${entry.level} - Score: ${entry.score} - Time: ${entry.time}s`;
    leaderboardList.appendChild(li);
  });
}


// Initialize (remove createBoard and updateLeaderboard calls here)
updateLeaderboard();

// Create a title for the game
const gameTitle = document.createElement('h1');
gameTitle.textContent = 'Memory Game';
gameTitle.style.textAlign = 'center';
gameTitle.style.marginBottom = '16px';
document.querySelector('.container')?.prepend(gameTitle);

// Hide all game elements initially
board.style.display = 'none';
timerDisplay.style.display = 'none';
restartGameBtn.style.display = 'none';
scoreDisplay.style.display = 'none';
leaderboard.style.display = 'none';
nextBtn.style.display = 'none';
levelLabel.style.display = 'none';
