import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import "./Container.css";

function Card(props) {
  const { win } = props;
  return (
    <div className="scene">
      <div className={`card ${win ? "is-flipped" : ""}`}>
        <div className="card__face card__face--front">{props.front}</div>
        <div className="card__face card__face--back">{props.back}</div>
      </div>
    </div>
  );
}

export default Card;
