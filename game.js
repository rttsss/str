const SIZE = 8;
const THEMES = {
  light: [
    { key: "meadow", name: { ru: "Луг", en: "Meadow" }, page: "#f3f7f0" },
    { key: "sunset", name: { ru: "Персик", en: "Peach" }, page: "#fcf3ef" },
    { key: "lagoon", name: { ru: "Лагуна", en: "Lagoon" }, page: "#eff7f7" },
    { key: "iris", name: { ru: "Ирис", en: "Iris" }, page: "#f8f1f6" },
    { key: "citrus", name: { ru: "Фисташка", en: "Pistachio" }, page: "#f5f7ed" },
    { key: "rose", name: { ru: "Роза", en: "Rose" }, page: "#fcf0f2" },
  ],
  dark: [
    { key: "midnight", name: { ru: "Полночь", en: "Midnight" }, page: "#171d27" },
    { key: "neon", name: { ru: "Неон", en: "Neon" }, page: "#101311" },
    { key: "deepsea", name: { ru: "Глубина", en: "Deep Sea" }, page: "#162126" },
    { key: "ember", name: { ru: "Уголь", en: "Ember" }, page: "#241b19" },
    { key: "twilight", name: { ru: "Сумерки", en: "Twilight" }, page: "#211d2b" },
    { key: "garden-night", name: { ru: "Ночной сад", en: "Night Garden" }, page: "#18231e" },
  ],
};
const COPY = {
  ru: {
    description: "Block Blast — спокойная головоломка с блоками, линиями и меняющимися темами.",
    brandHome: "Block Blast — главная",
    language: "Язык",
    appearance: "Режим оформления",
    lightMode: "Светлая тема",
    darkMode: "Тёмная тема",
    theme: "ТЕМА",
    newGame: "Новая игра",
    gameKicker: "BLOCK PUZZLE · КЛАССИКА",
    gameTurn: "Твой ход",
    choosePosition: "Выбери позицию",
    selectPiece: "Выбери фигуру",
    pieceSelected: "Фигура выбрана",
    chooseFirst: "Сначала выбери фигуру",
    invalidPosition: "Эта позиция занята или выходит за край",
    goodMove: "Хороший ход",
    noMoves: "Больше нет доступных ходов",
    lineCleared: (name) => `Линия очищена · тема «${name}»`,
    linesCleared: (count, name) => `Линий очищено: ${count} · тема «${name}»`,
    score: "Очки",
    best: "Рекорд",
    lines: "Линии",
    stats: "Статистика игры",
    board: "Игровое поле 8 на 8",
    sidebar: "Игровые фигуры",
    piecesKicker: "СЛЕДУЮЩИЕ",
    piecesTitle: "Фигуры",
    chooseShape: (name) => `Выбрать фигуру «${name}»`,
    freeCell: "Свободная клетка",
    occupiedCell: "Занятая клетка",
    row: "ряд",
    column: "столбец",
    palette: (index, total) => `ПАЛИТРА ${index} / ${total}`,
    roundOver: "РАУНД ЗАВЕРШЁН",
    gameOverTitle: "Хорошая игра",
    playAgain: "Играть снова",
    finalScore: "Очки",
    themeFooter: (index, name) => `${index} · ${name}`,
  },
  en: {
    description: "Block Blast is a relaxing puzzle game with blocks, line clears, and changing color themes.",
    brandHome: "Block Blast home",
    language: "Language",
    appearance: "Color theme mode",
    lightMode: "Light theme",
    darkMode: "Dark theme",
    theme: "THEME",
    newGame: "New game",
    gameKicker: "BLOCK PUZZLE · CLASSIC",
    gameTurn: "Your turn",
    choosePosition: "Choose a position",
    selectPiece: "Choose a piece",
    pieceSelected: "Piece selected",
    chooseFirst: "Choose a piece first",
    invalidPosition: "That position is occupied or out of bounds",
    goodMove: "Nice move",
    noMoves: "No more moves available",
    lineCleared: (name) => `Line cleared · theme “${name}”`,
    linesCleared: (count, name) => `Lines cleared: ${count} · theme “${name}”`,
    score: "Score",
    best: "Best",
    lines: "Lines",
    stats: "Game statistics",
    board: "8 by 8 game board",
    sidebar: "Game pieces",
    piecesKicker: "UP NEXT",
    piecesTitle: "Pieces",
    chooseShape: (name) => `Select ${name} piece`,
    freeCell: "Empty cell",
    occupiedCell: "Occupied cell",
    row: "row",
    column: "column",
    palette: (index, total) => `PALETTE ${index} / ${total}`,
    roundOver: "ROUND OVER",
    gameOverTitle: "Good game",
    playAgain: "Play again",
    finalScore: "Score",
    themeFooter: (index, name) => `${index} · ${name}`,
  },
};
const SHAPE_NAMES_EN = {
  "Квадрат": "Square",
  "Тройка": "Three-block",
  "Угол": "Corner",
  "Т-образная": "T-shape",
  "Зигзаг": "Zigzag",
  "Линия 2": "Two-block line",
  "Линия 3": "Three-block line",
  "Линия 4": "Four-block line",
  "Линия 5": "Five-block line",
  "Длинный угол": "Long corner",
  "Крест": "Cross",
  "Плитка": "Single block",
};
const SHAPES = [
  { name: "Квадрат", cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  { name: "Тройка", cells: [[0, 0], [1, 0], [1, 1]] },
  { name: "Угол", cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
  { name: "Т-образная", cells: [[0, 1], [1, 0], [1, 1], [1, 2]] },
  { name: "Зигзаг", cells: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  { name: "Линия 2", cells: [[0, 0], [0, 1]] },
  { name: "Линия 3", cells: [[0, 0], [0, 1], [0, 2]] },
  { name: "Линия 4", cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  { name: "Линия 5", cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
  { name: "Длинный угол", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]] },
  { name: "Крест", cells: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]] },
  { name: "Плитка", cells: [[0, 0]] },
];

const boardElement = document.querySelector("#board");
const trayElement = document.querySelector("#piece-tray");
const messageElement = document.querySelector("#game-message");
const hintElement = document.querySelector("#piece-hint");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const linesElement = document.querySelector("#lines-cleared");
const pieceCountElement = document.querySelector("#piece-count");
const themeNameElement = document.querySelector("#theme-name");
const themeNoteTitleElement = document.querySelector("#theme-note-title");
const themeNoteCountElement = document.querySelector("#theme-note-count");
const footerThemeElement = document.querySelector("#footer-theme");
const gameOverDialog = document.querySelector("#game-over");
const cellElements = [];

let grid;
let pieces;
let selectedPieceId = null;
let hoverAnchor = null;
let score = 0;
let bestScore = readBestScore();
let clearedLines = 0;
let pieceId = 0;
let themeIndex = 0;
let colorMode = readColorMode();
let language = readLanguage();
let messageKey = "gameTurn";
let messageParams = [];
let hintKey = "selectPiece";

function readBestScore() {
  try {
    const value = Number(localStorage.getItem("block-blast-best") || 0);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function readColorMode() {
  try {
    return localStorage.getItem("block-blast-mode") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function readLanguage() {
  try {
    return localStorage.getItem("block-blast-language") === "en" ? "en" : "ru";
  } catch {
    return "ru";
  }
}

function localizedShapeName(name) {
  return language === "en" ? SHAPE_NAMES_EN[name] || name : name;
}

function setMessage(key, ...params) {
  messageKey = key;
  messageParams = params;
  renderMessage();
}

function renderMessage() {
  const value = COPY[language][messageKey];
  const params = [...messageParams];
  if (messageKey === "lineCleared" || messageKey === "linesCleared") {
    const themeKey = params.at(-1);
    const theme = Object.values(THEMES).flat().find((candidate) => candidate.key === themeKey);
    params[params.length - 1] = theme ? theme.name[language] : themeKey;
  }
  messageElement.textContent = typeof value === "function" ? value(...params) : value;
}

function setHint(key) {
  hintKey = key;
  hintElement.textContent = COPY[language][key];
}

function applyLanguage() {
  const copy = COPY[language];
  const setText = (selector, value) => {
    document.querySelector(selector).textContent = value;
  };

  document.documentElement.lang = language;
  document.querySelector('meta[name="description"]').content = copy.description;
  document.querySelector("#brand-link").setAttribute("aria-label", copy.brandHome);
  document.querySelector("#language-switch").setAttribute("aria-label", copy.language);
  document.querySelector("#appearance-switch").setAttribute("aria-label", copy.appearance);
  document.querySelector("#ru-language").setAttribute("aria-pressed", String(language === "ru"));
  document.querySelector("#en-language").setAttribute("aria-pressed", String(language === "en"));
  document.querySelector("#light-mode").setAttribute("aria-label", copy.lightMode);
  document.querySelector("#light-mode").title = copy.lightMode;
  document.querySelector("#dark-mode").setAttribute("aria-label", copy.darkMode);
  document.querySelector("#dark-mode").title = copy.darkMode;
  setText("#theme-caption", copy.theme);
  setText("#new-game", copy.newGame);
  setText("#game-kicker", copy.gameKicker);
  setText("#score-label", copy.score);
  setText("#best-label", copy.best);
  setText("#lines-label", copy.lines);
  document.querySelector("#score-strip").setAttribute("aria-label", copy.stats);
  setText("#pieces-kicker", copy.piecesKicker);
  setText("#pieces-title", copy.piecesTitle);
  document.querySelector(".game-sidebar").setAttribute("aria-label", copy.sidebar);
  document.querySelector("#board").setAttribute("aria-label", copy.board);
  setText("#game-over-kicker", copy.roundOver);
  setText("#game-over-title", copy.gameOverTitle);
  setText("#final-score-label", copy.finalScore);
  setText("#play-again", copy.playAgain);
  renderMessage();
  setHint(hintKey);
}

function setLanguage(nextLanguage) {
  if (!COPY[nextLanguage] || language === nextLanguage) return;
  language = nextLanguage;
  try {
    localStorage.setItem("block-blast-language", language);
  } catch {
    // Language selection still works for this visit when browser storage is unavailable.
  }
  applyLanguage();
  applyTheme();
  renderPieces();
  renderBoard();
}

function saveBestScore() {
  try {
    localStorage.setItem("block-blast-best", String(bestScore));
  } catch {
    // The current score remains playable when browser storage is unavailable.
  }
}

function createBoard() {
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "board-cell";
      cell.dataset.row = String(row);
      cell.dataset.column = String(column);
      cell.setAttribute("aria-label", `${COPY[language].row} ${row + 1}, ${COPY[language].column} ${column + 1}`);
      boardElement.append(cell);
      cellElements.push(cell);
    }
  }
}

function shuffledShapes() {
  const available = [...SHAPES];
  for (let index = available.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [available[index], available[otherIndex]] = [available[otherIndex], available[index]];
  }
  return available.slice(0, 3).map((shape) => ({
    ...shape,
    id: ++pieceId,
    tone: Math.floor(Math.random() * 3),
    width: Math.max(...shape.cells.map(([, column]) => column)) + 1,
    height: Math.max(...shape.cells.map(([row]) => row)) + 1,
  }));
}

function renderPieces() {
  trayElement.replaceChildren();
  pieceCountElement.textContent = String(pieces.length);

  for (const piece of pieces) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "piece-token";
    button.dataset.pieceId = String(piece.id);
    button.setAttribute("aria-label", COPY[language].chooseShape(localizedShapeName(piece.name)));
    button.setAttribute("aria-pressed", String(selectedPieceId === piece.id));
    button.classList.toggle("is-selected", selectedPieceId === piece.id);

    const visual = document.createElement("span");
    visual.className = "piece-visual";
    for (const [row, column] of piece.cells) {
      const block = document.createElement("span");
      block.className = "piece-cell";
      block.style.gridRow = String(row + 1);
      block.style.gridColumn = String(column + 1);
      block.style.setProperty("--piece-color", `var(--block-${piece.tone + 1})`);
      visual.append(block);
    }
    button.append(visual);
    button.addEventListener("click", () => selectPiece(piece.id));
    trayElement.append(button);
  }
}

function renderBoard() {
  const selectedPiece = pieces.find((piece) => piece.id === selectedPieceId);
  const preview = selectedPiece && hoverAnchor
    ? getPlacement(selectedPiece, hoverAnchor.row, hoverAnchor.column)
    : null;
  const previewKeys = new Set(preview?.cells.map(({ row, column }) => `${row},${column}`) || []);

  for (const cell of cellElements) {
    const row = Number(cell.dataset.row);
    const column = Number(cell.dataset.column);
    const tone = grid[row][column];
    const isPreview = previewKeys.has(`${row},${column}`);

    cell.classList.toggle("is-filled", tone !== null);
    cell.classList.toggle("is-preview", Boolean(isPreview && preview.valid));
    cell.classList.toggle("is-preview-invalid", Boolean(isPreview && !preview.valid));
    const copy = COPY[language];
    cell.setAttribute("aria-label", `${tone === null ? copy.freeCell : copy.occupiedCell}, ${copy.row} ${row + 1}, ${copy.column} ${column + 1}`);
    cell.style.setProperty("--cell-color", tone === null
      ? (isPreview && preview.valid ? `var(--block-${selectedPiece.tone + 1})` : "")
      : `var(--block-${tone + 1})`);
  }
}

function renderStats() {
  scoreElement.textContent = String(score);
  bestScoreElement.textContent = String(bestScore);
  linesElement.textContent = String(clearedLines);
}

function applyTheme() {
  const availableThemes = THEMES[colorMode];
  const theme = availableThemes[themeIndex];
  document.documentElement.dataset.theme = theme.key;
  document.documentElement.dataset.mode = colorMode;
  document.querySelector('meta[name="theme-color"]').content = theme.page;
  const themeName = theme.name[language];
  const paddedIndex = String(themeIndex + 1).padStart(2, "0");
  const paddedCount = String(availableThemes.length).padStart(2, "0");
  themeNameElement.textContent = themeName;
  themeNoteTitleElement.textContent = themeName;
  themeNoteCountElement.textContent = COPY[language].palette(paddedIndex, paddedCount);
  footerThemeElement.textContent = COPY[language].themeFooter(paddedIndex, themeName.toLocaleUpperCase(language === "ru" ? "ru-RU" : "en-US"));
  document.querySelector("#light-mode").setAttribute("aria-pressed", String(colorMode === "light"));
  document.querySelector("#dark-mode").setAttribute("aria-pressed", String(colorMode === "dark"));
}

function setColorMode(mode) {
  if (!THEMES[mode] || colorMode === mode) return;
  colorMode = mode;
  themeIndex = 0;
  try {
    localStorage.setItem("block-blast-mode", colorMode);
  } catch {
    // Theme selection still works for this visit when browser storage is unavailable.
  }
  applyTheme();
}

function selectPiece(id) {
  selectedPieceId = selectedPieceId === id ? null : id;
  hoverAnchor = null;
  const isSelected = selectedPieceId !== null;
  setMessage(isSelected ? "choosePosition" : "gameTurn");
  setHint(isSelected ? "pieceSelected" : "selectPiece");
  renderPieces();
  renderBoard();
  trayElement.querySelector(`[data-piece-id="${selectedPieceId ?? id}"]`)?.focus({ preventScroll: true });
}

function getPlacement(piece, row, column) {
  const cells = piece.cells.map(([rowOffset, columnOffset]) => ({
    row: row + rowOffset,
    column: column + columnOffset,
  }));
  const inBounds = cells.every(({ row: targetRow, column: targetColumn }) => (
    targetRow >= 0 && targetRow < SIZE && targetColumn >= 0 && targetColumn < SIZE
  ));
  const isEmpty = inBounds && cells.every(({ row: targetRow, column: targetColumn }) => (
    grid[targetRow][targetColumn] === null
  ));

  return { cells, valid: inBounds && isEmpty };
}

function handleBoardClick(event) {
  const cell = event.target.closest(".board-cell");
  if (!cell) return;

  const piece = pieces.find((candidate) => candidate.id === selectedPieceId);
  if (!piece) {
    setMessage("chooseFirst");
    return;
  }

  const row = Number(cell.dataset.row);
  const column = Number(cell.dataset.column);
  const placement = getPlacement(piece, row, column);
  if (!placement.valid) {
    setMessage("invalidPosition");
    hoverAnchor = { row, column };
    renderBoard();
    return;
  }

  for (const target of placement.cells) {
    grid[target.row][target.column] = piece.tone;
  }

  score += piece.cells.length;
  pieces = pieces.filter((candidate) => candidate.id !== piece.id);
  selectedPieceId = null;
  hoverAnchor = null;

  const cleared = clearCompletedLines();
  if (cleared.lineCount > 0) {
    clearedLines += cleared.lineCount;
    score += (cleared.cells.size * 2) + (cleared.lineCount * 8);
    themeIndex = (themeIndex + 1) % THEMES[colorMode].length;
    applyTheme();
    const themeKey = THEMES[colorMode][themeIndex].key;
    const message = cleared.lineCount === 1
      ? ["lineCleared", themeKey]
      : ["linesCleared", cleared.lineCount, themeKey];
    setMessage(...message);
  } else {
    setMessage("goodMove");
  }

  if (score > bestScore) {
    bestScore = score;
    saveBestScore();
  }

  if (pieces.length === 0) pieces = shuffledShapes();
  renderPieces();
  renderBoard();
  renderStats();

  if (!hasAnyMove()) finishGame();
}

function clearCompletedLines() {
  const fullRows = [];
  const fullColumns = [];

  for (let row = 0; row < SIZE; row += 1) {
    if (grid[row].every((cell) => cell !== null)) fullRows.push(row);
  }

  for (let column = 0; column < SIZE; column += 1) {
    if (grid.every((row) => row[column] !== null)) fullColumns.push(column);
  }

  const cells = new Set();
  for (const row of fullRows) {
    for (let column = 0; column < SIZE; column += 1) cells.add(`${row},${column}`);
  }
  for (const column of fullColumns) {
    for (let row = 0; row < SIZE; row += 1) cells.add(`${row},${column}`);
  }

  for (const key of cells) {
    const [row, column] = key.split(",").map(Number);
    grid[row][column] = null;
  }

  return { cells, lineCount: fullRows.length + fullColumns.length };
}

function hasAnyMove() {
  return pieces.some((piece) => {
    for (let row = 0; row <= SIZE - piece.height; row += 1) {
      for (let column = 0; column <= SIZE - piece.width; column += 1) {
        if (getPlacement(piece, row, column).valid) return true;
      }
    }
    return false;
  });
}

function finishGame() {
  document.querySelector("#final-score").textContent = String(score);
  setMessage("noMoves");
  gameOverDialog.showModal();
}

function startGame() {
  grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  pieces = shuffledShapes();
  selectedPieceId = null;
  hoverAnchor = null;
  score = 0;
  clearedLines = 0;
  themeIndex = 0;
  applyTheme();
  setMessage("gameTurn");
  setHint("selectPiece");
  renderPieces();
  renderBoard();
  renderStats();
  if (gameOverDialog.open) gameOverDialog.close();
}

createBoard();
boardElement.addEventListener("click", handleBoardClick);
boardElement.addEventListener("pointerover", (event) => {
  const cell = event.target.closest(".board-cell");
  if (!cell || selectedPieceId === null) return;
  hoverAnchor = { row: Number(cell.dataset.row), column: Number(cell.dataset.column) };
  renderBoard();
});
boardElement.addEventListener("pointerleave", () => {
  hoverAnchor = null;
  renderBoard();
});
document.querySelector("#new-game").addEventListener("click", startGame);
document.querySelector("#play-again").addEventListener("click", startGame);
document.querySelector("#light-mode").addEventListener("click", () => setColorMode("light"));
document.querySelector("#dark-mode").addEventListener("click", () => setColorMode("dark"));
document.querySelector("#ru-language").addEventListener("click", () => setLanguage("ru"));
document.querySelector("#en-language").addEventListener("click", () => setLanguage("en"));
gameOverDialog.addEventListener("cancel", (event) => event.preventDefault());
bestScoreElement.textContent = String(bestScore);
applyLanguage();
startGame();
