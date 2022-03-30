import { fail } from "assert";
import React, { useEffect, useState } from "react";
import Button from "../btn/button";

function Form() {
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);
  const [isJoinDisabled, setIsJoinDisabled] = useState(true);

  const [roomInfo, setRoomInfo] = useState({ user: "", roomID: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(e.target);
    setRoomInfo({ ...roomInfo, [name]: value });
  };

  useEffect(() => {
    const createDisable = roomInfo.user ? false : true;
    const joinDisable = roomInfo.user && roomInfo.roomID ? false : true;
    setIsCreateDisabled(createDisable);
    setIsJoinDisabled(joinDisable);
  }, [roomInfo]);

  const createHandler = () => {};
  const joinHandler = () => {};
  return (
    <>
      <form className="form">
        <div className="group-input col user-input">
          <label htmlFor="user">Usuario</label>
          <input
            type="text"
            name="user"
            id="user"
            value={roomInfo.user}
            onChange={handleChange}
          />
        </div>
        <div className="group-input col">
          <label htmlFor="user">Id de la sala</label>
          <input
            type="text"
            name="roomID"
            id="roomID"
            value={roomInfo.roomID}
            onChange={handleChange}
          />
        </div>
        <div className="group-btn col">
          <Button
            extraClasses=""
            text="Crear sala"
            disabled={isCreateDisabled}
            handler={createHandler}
          />
          <Button
            extraClasses=""
            text="Unirse sala"
            disabled={isJoinDisabled}
            handler={joinHandler}
          />
        </div>
      </form>
    </>
  );
}

export default Form;
