import React from "react";
import { Player } from "../../interfaces/interfaces";
import Button from "../btn/button";
import LobbyPlayer from "./lobbyPlayer";

interface PlayerListProps {
  players: Player[];
  changeHandler: React.MouseEventHandler<HTMLElement>;
}
export default function PlayersList({
  players,
  changeHandler,
}: PlayerListProps) {
  return (
    <>
      <div className="first">
        {players.map((p, index) => {
          if (p.playerNumber === 1 || p.playerNumber === 2)
            if (p.id === "0")
              return (
                <div className="p top flex">
                  <Button
                    extraClasses=""
                    disabled={false}
                    text="Click para entrar!"
                    handler={changeHandler}
                  />
                </div>
              );
            else
              return (
                <LobbyPlayer
                  key={index}
                  pnumber={p.playerNumber}
                  user={p.user}
                />
              );

          return "";
        })}
      </div>
      <div className="second">
        {players.map((p, index) => {
          if (p.playerNumber === 3 || p.playerNumber === 4)
            if (p.id === "0")
              return (
                <div className="p top flex">
                  <Button
                    extraClasses=""
                    disabled={false}
                    text="Click para entrar!"
                    handler={changeHandler}
                  />
                </div>
              );
            else
              return (
                <LobbyPlayer
                  key={index}
                  pnumber={p.playerNumber}
                  user={p.user}
                />
              );
          return "";
        })}
      </div>
    </>
  );
}
