const board = document.getElementById('game-board');

const timerDisplay = document.getElementById('timer');
const restartLevelBtn = document.getElementById('restart');

// Create and insert Restart Game button
let restartGameBtn = document.createElement('button');
restartGameBtn.id = 'restart-game';
restartGameBtn.textContent = 'Restart Game';
restartGameBtn.style.marginLeft = '12px';
restartGameBtn.addEventListener('click', () => {
  level = 1;
  resetGame();
  nextBtn.style.display = 'none';
});
document.querySelector('.container')?.appendChild(restartGameBtn);

// Each card has a unique cardId, and a pairId for matching (pairId never in DOM)
const basePairs = [
  { pairId: 1, seo: 'Focus keyword optimization' },
  { pairId: 1, seo: 'Meta description best practices' },
  { pairId: 2, seo: 'Internal linking strategy' },
  { pairId: 2, seo: 'Anchor text relevance' },
  { pairId: 3, seo: 'Readability analysis Yoast' },
  { pairId: 3, seo: 'Passive voice reduction' },
  { pairId: 4, seo: 'SEO title length' },
  { pairId: 4, seo: 'Slug optimization tips' },
  { pairId: 5, seo: 'Alt text for images' },
  { pairId: 5, seo: 'Image SEO Yoast' },
  { pairId: 6, seo: 'Outbound links quality' },
  { pairId: 6, seo: 'External link attributes' },
  { pairId: 7, seo: 'Keyphrase density' },
  { pairId: 7, seo: 'Keyword stuffing warning' },
  { pairId: 8, seo: 'Content length recommendation' },
  { pairId: 8, seo: 'Minimum word count SEO' }
];

let cardsData = [];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let startTime = null;
let timerInterval = null;
let level = 1;
let maxPairs = Math.floor(basePairs.length / 2);

// Create and insert Next Level button
let nextBtn = document.createElement('button');
nextBtn.id = 'next-level';
nextBtn.textContent = 'Next Level';
nextBtn.style.display = 'none';
nextBtn.style.marginTop = '16px';
nextBtn.addEventListener('click', () => {
  level++;
  resetGame();
  nextBtn.style.display = 'none';
});
document.querySelector('.container')?.appendChild(nextBtn);

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
  let numPairs = Math.min(Math.pow(2, level - 1), maxPairs);
  // Use only as many pairs as needed for this level
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
    card.innerHTML = '';
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
      // All cards matched for this level
      if (matchedCount === cardList.length) {
        clearInterval(timerInterval);
        updateTimer();
        setTimeout(() => {
          alert(`Congratulations! You finished level ${level} in ${getElapsedSeconds()} seconds.`);
          // Only show next button if more levels are possible
          if (Math.pow(2, level) <= maxPairs * 2) {
            nextBtn.style.display = 'inline-block';
          }
        }, 300);
      }
    } else {
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
  createBoard();
}


// Rename the existing restart button to 'Restart Level'
restartLevelBtn.textContent = 'Restart Level';
restartLevelBtn.addEventListener('click', () => {
  resetGame();
  nextBtn.style.display = 'none';
});

// Initialize
createBoard();
