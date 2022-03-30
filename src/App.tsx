import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Game } from "./pages/game/game";
import { Home } from "./pages/home/home";
import Lobby from "./pages/lobby/lobby";
import { NotFount } from "./pages/notFount/notFount";
import { connection } from "./utils/socketContext";
function App() {
  const socket = connection();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/lobby" element={<Lobby />}></Route>
          <Route path="/game" element={<Game />}></Route>
          <Route path="*" element={<NotFount />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
