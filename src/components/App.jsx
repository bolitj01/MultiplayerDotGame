import { useState } from "react";
import { io } from "socket.io-client";
import PlayerList from "./PlayerList";
import Dot from "./Dot";

const socket = io(
  import.meta.env.PROD
    ? window.location.origin   // use Render backend in production
    : "http://localhost:3000"  // use local backend in dev
);

export default function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  function joinGame() {
    if (!username.trim()) return;
    socket.emit("join", username);
    setJoined(true);
  }

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <div>
          <h2>Enter Username</h2>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinGame}>Join</button>
        </div>
      ) : (
        <>
          <Dot socket={socket} />
          <PlayerList socket={socket} />
        </>
      )}
    </div>
  );
}
