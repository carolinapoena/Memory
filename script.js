const board = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

// Each pair has the same id but different SEO/Yoast phrases
const cardsData = [
  { id: 1, seo: 'Focus keyword optimization' },
  { id: 1, seo: 'Meta description best practices' },
  { id: 2, seo: 'Internal linking strategy' },
  { id: 2, seo: 'Anchor text relevance' },
  { id: 3, seo: 'Readability analysis Yoast' },
  { id: 3, seo: 'Passive voice reduction' },
  { id: 4, seo: 'SEO title length' },
  { id: 4, seo: 'Slug optimization tips' },
  { id: 5, seo: 'Alt text for images' },
  { id: 5, seo: 'Image SEO Yoast' },
  { id: 6, seo: 'Outbound links quality' },
  { id: 6, seo: 'External link attributes' },
  { id: 7, seo: 'Keyphrase density' },
  { id: 7, seo: 'Keyword stuffing warning' },
  { id: 8, seo: 'Content length recommendation' },
  { id: 8, seo: 'Minimum word count SEO' }
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
  // 8 pairs, 16 cards, each pair has different phrase but same id
  const cardList = shuffle([...cardsData]);
  board.innerHTML = '';
  cards = [];
  matchedCount = 0;
  flippedCards = [];
  cardList.forEach((cardInfo, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = cardInfo.id;
    card.dataset.seo = cardInfo.seo;
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
  card.innerHTML = card.dataset.seo;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;
    if (card1.dataset.id === card2.dataset.id) {
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
