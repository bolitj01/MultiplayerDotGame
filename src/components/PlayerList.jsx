import { useEffect, useState } from "react";

export default function PlayerList({ socket }) {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    socket.on("players", (data) => {
      setPlayers(data);
    });

    return () => {
      socket.off("players");
    };
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Leaderboard</h3>
      <ul>
        {Object.values(players)
          .sort((a, b) => b.score - a.score)
          .map((p, i) => (
            <li key={i}>
              {p.username}: {p.score}
            </li>
          ))}
      </ul>
    </div>
  );
}
