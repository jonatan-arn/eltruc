import React from "react";

interface LobbyPlayerC {
  pnumber: number;
  user: string;
}
export default function LobbyPlayer({ pnumber, user }: LobbyPlayerC) {
  return (
    <div className="p flex top">
      <div className="legend">
        <p className="numberP">Jugador {pnumber}</p>
      </div>
      <div className="pText flex">
        <p className="user">{user}</p>
      </div>
    </div>
  );
}
