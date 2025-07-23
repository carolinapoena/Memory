const board = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

const symbols = [
  '🍎','🍌','🍇','🍉','🍒','🍋','🍓','🍍'
];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let startTime = null;
let timerInterval = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  // 8 pairs, 16 cards
  const cardSymbols = shuffle([...symbols, ...symbols]);
  board.innerHTML = '';
  cards = [];
  matchedCount = 0;
  flippedCards = [];
  cardSymbols.forEach((symbol, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
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
  card.innerHTML = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedCount += 2;
      flippedCards = [];
      if (matchedCount === 16) {
        clearInterval(timerInterval);
        updateTimer();
        setTimeout(() => {
          alert(`Congratulations! You finished in ${getElapsedSeconds()} seconds.`);
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

restartBtn.addEventListener('click', resetGame);

// Initialize
createBoard();
