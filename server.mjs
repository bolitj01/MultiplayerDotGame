import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for this example
    methods: ["GET", "POST"],
  },
});

// Store players
let players = {}; // { socketId: { username, score } }
let currentDot = null;

function generateDot() {
  return {
    x: Math.random() * 90 + 5,  // percent left
    y: Math.random() * 80 + 10, // percent top
  };
}

// Serve React build
app.use(express.static(path.join(__dirname, "./dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("join", (username) => {
    players[socket.id] = { username, score: 0 };

    // Send leaderboard + current dot
    io.emit("players", players);

    // If no dot yet, generate one
    if (!currentDot) {
      currentDot = generateDot();
      io.emit("dot", currentDot);
    }
  });

  socket.on("clickedDot", () => {
    if (!players[socket.id]) return;

    // Point goes to first click (server is authoritative)
    players[socket.id].score += 1;

    // Send updated scores
    io.emit("players", players);

    // Create new dot
    currentDot = generateDot();
    io.emit("dot", currentDot);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players", players);
  });
});

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
