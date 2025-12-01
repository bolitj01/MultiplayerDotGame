import { useEffect, useState } from "react";

export default function Dot({ socket }) {
  const [dot, setDot] = useState(null);

  useEffect(() => {
    socket.on("dot", (newDot) => {
      setDot(newDot);
    });

    return () => {
      socket.off("dot");
    };
  }, []);

  if (!dot) return null;

  const style = {
    position: "absolute",
    left: dot.x + "%",
    top: dot.y + "%",
    width: 30,
    height: 30,
    backgroundColor: "red",
    borderRadius: "50%",
    cursor: "pointer",
    transform: "translate(-50%, -50%)",
  };

  return <div style={style} onClick={() => socket.emit("clickedDot")} />;
}
