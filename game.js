const SIZE = 8;
const THEMES = {
  light: [
    { key: "meadow", name: "Луг", page: "#f3f7f0" },
    { key: "sunset", name: "Персик", page: "#fcf3ef" },
    { key: "lagoon", name: "Лагуна", page: "#eff7f7" },
    { key: "iris", name: "Ирис", page: "#f8f1f6" },
    { key: "citrus", name: "Фисташка", page: "#f5f7ed" },
    { key: "rose", name: "Роза", page: "#fcf0f2" },
  ],
  dark: [
    { key: "midnight", name: "Полночь", page: "#171d27" },
    { key: "neon", name: "Неон", page: "#101311" },
    { key: "deepsea", name: "Глубина", page: "#162126" },
    { key: "ember", name: "Уголь", page: "#241b19" },
    { key: "twilight", name: "Сумерки", page: "#211d2b" },
    { key: "garden-night", name: "Ночной сад", page: "#18231e" },
  ],
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
      cell.setAttribute("aria-label", `Ряд ${row + 1}, столбец ${column + 1}`);
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
    button.setAttribute("aria-label", `Выбрать фигуру «${piece.name}»`);
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
    cell.setAttribute("aria-label", `${tone === null ? "Свободная" : "Занятая"} клетка, ряд ${row + 1}, столбец ${column + 1}`);
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
  themeNameElement.textContent = theme.name;
  themeNoteTitleElement.textContent = theme.name;
  themeNoteCountElement.textContent = `ПАЛИТРА ${String(themeIndex + 1).padStart(2, "0")} / ${String(availableThemes.length).padStart(2, "0")}`;
  footerThemeElement.textContent = `${String(themeIndex + 1).padStart(2, "0")} · ${theme.name.toLocaleUpperCase("ru-RU")}`;
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
  messageElement.textContent = isSelected ? "Выбери позицию" : "Твой ход";
  hintElement.textContent = isSelected ? "Фигура выбрана" : "Выбери фигуру";
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
    messageElement.textContent = "Сначала выбери фигуру";
    return;
  }

  const row = Number(cell.dataset.row);
  const column = Number(cell.dataset.column);
  const placement = getPlacement(piece, row, column);
  if (!placement.valid) {
    messageElement.textContent = "Эта позиция занята или выходит за край";
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
    messageElement.textContent = cleared.lineCount === 1
      ? `Линия очищена · тема «${THEMES[colorMode][themeIndex].name}»`
      : `Линий очищено: ${cleared.lineCount} · тема «${THEMES[colorMode][themeIndex].name}»`;
  } else {
    messageElement.textContent = "Хороший ход";
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
  messageElement.textContent = "Больше нет доступных ходов";
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
  messageElement.textContent = "Твой ход";
  hintElement.textContent = "Выбери фигуру";
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
gameOverDialog.addEventListener("cancel", (event) => event.preventDefault());
bestScoreElement.textContent = String(bestScore);
startGame();
