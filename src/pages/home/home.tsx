import React from "react";
import { useMediaQuery } from "react-responsive";
import Form from "../../components/form/form";
import "./home.css";

export function Home() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });
  return (
    <>
      {isDesktopOrLaptop && (
        <div className="box">
          <div className="text">
            <h2>El juego del truc online</h2>
          </div>
          <div className="form-div">
            <Form />
          </div>
        </div>
      )}
      {isTabletOrMobile && (
        <div className="box  xsBox">
          <Form />
        </div>
      )}
    </>
  );
}
