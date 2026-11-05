const boardElement = document.querySelector("#board");
const trayElement = document.querySelector("#piece-tray");

const starterShapes = [
  { name: "Квадрат", cells: [[1, 1], [1, 2], [2, 1], [2, 2]], tone: 0 },
  { name: "Угол", cells: [[1, 1], [2, 1], [2, 2], [2, 3]], tone: 1 },
  { name: "Линия", cells: [[2, 0], [2, 1], [2, 2], [2, 3]], tone: 2 },
];

for (let index = 0; index < 64; index += 1) {
  const row = Math.floor(index / 8);
  const column = index % 8;
  const cell = document.createElement("div");
  cell.className = "board-cell";
  cell.setAttribute("role", "gridcell");
  cell.setAttribute("aria-label", `Ряд ${row + 1}, столбец ${column + 1}`);
  boardElement.append(cell);
}

for (const shape of starterShapes) {
  const token = document.createElement("div");
  token.className = "piece-token";
  token.setAttribute("aria-label", `Фигура: ${shape.name}`);

  const visual = document.createElement("div");
  visual.className = "piece-visual";
  for (const [row, column] of shape.cells) {
    const cell = document.createElement("span");
    cell.className = "piece-cell";
    cell.style.gridRow = String(row + 1);
    cell.style.gridColumn = String(column + 1);
    cell.style.setProperty("--piece-color", `var(--block-${shape.tone + 1})`);
    visual.append(cell);
  }
  token.append(visual);
  trayElement.append(token);
}
