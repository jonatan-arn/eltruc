import React, { useEffect, useState } from "react";
import Button from "../../components/btn/button";
import PlayersList from "../../components/lobby player/playersList";
import { Player } from "../../interfaces/interfaces";
import "./lobby.css";
const defaultPlayers: Player[] = [
  {
    id: "0",
    playerNumber: 1,
    room: "0",
    turn: false,
    user: "",
    owner: false,
  },
  {
    id: "0",
    playerNumber: 2,
    room: "0",
    turn: false,
    user: "",
    owner: false,
  },
  {
    id: "0",
    playerNumber: 3,
    room: "0",
    turn: false,
    user: "",
    owner: false,
  },
  {
    id: "0",
    playerNumber: 4,
    room: "0",
    turn: false,
    user: "",
    owner: false,
  },
];
export default function Lobby() {
  const [startDisabled, setStartDisabled] = useState(true);
  const [players, setPlayers] = useState(defaultPlayers);
  const [roomID, setRoomID] = useState("00000");
  const [IDview, setIDview] = useState([""]);
  const startHandler = () => {};
  const changeHandler = () => {};
  useEffect(() => {
    let newIDview: string[] = [];
    roomID.split("").forEach((char) => newIDview.push(char));
    setIDview(newIDview);
  }, [roomID]);
  return (
    <>
      <div className="lbox flex">
        <Button
          extraClasses="btn-margins"
          text="Comenzar la partida"
          disabled={startDisabled}
          handler={startHandler}
        />
        <div className="code">
          <h2>Codigo de la sala</h2>
          <p className="flex row">
            {IDview.map((n) => {
              return <span className="IDn flex"> {n}</span>;
            })}
          </p>
        </div>
        <div className="players">
          <PlayersList changeHandler={changeHandler} players={players} />
        </div>
      </div>
    </>
  );
}
