const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const chatBox = document.getElementById("chatBox");

let board = Array(9).fill(null);
let gameOver = false;

function move(i) {
  if (board[i] || gameOver) return;
  board[i] = "X";
  cells[i].textContent = "X";

  if (checkWin("X")) return endGame("You win!");
  aiMove();
}

function aiMove() {
  const i = board.findIndex(v => v === null);
  if (i === -1) return endGame("Draw");
  board[i] = "O";
  cells[i].textContent = "O";

  if (checkWin("O")) return endGame("AI wins");
}

function checkWin(m) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => board[i] === m));
}

function endGame(msg) {
  status.textContent = msg;
  gameOver = true;
  askAI(msg);
}

function resetGame() {
  board.fill(null);
  cells.forEach(c => c.textContent = "");
  status.textContent = "Your turn";
  gameOver = false;
}

function addMsg(role, text) {
  const d = document.createElement("div");
  d.className =
    role === "user"
      ? "ml-auto bg-blue-600 p-2 rounded-xl max-w-xs"
      : "mr-auto bg-slate-700 p-2 rounded-xl max-w-xs";
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  addMsg("user", msg);
  input.value = "";

  const res = await fetch("https://YOUR-BACKEND.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      board: board.map(v => v || "-").join("")
    })
  });

  const data = await res.json();
  addMsg("ai", data.reply);
}

function askAI(event) {
  fetch("https://YOUR-BACKEND.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Game event: ${event}`,
      board: board.map(v => v || "-").join("")
    })
  })
    .then(r => r.json())
    .then(d => addMsg("ai", d.reply));
}
