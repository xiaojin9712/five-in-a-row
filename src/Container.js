import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import "./Container.css";

function Card(props) {
  const { win:flipped } = props;
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <div>
      <a.div
        class="c back"
        style={{ opacity: opacity.interpolate((o) => 1 - o), transform }}
      >
        {props.back}
      </a.div>
      <a.div
        class="c front"
        style={{
          opacity,
          transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
        }}
      >
        {props.front}
      </a.div>
    </div>
  );
}

export default Card;