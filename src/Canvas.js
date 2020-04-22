/**
 * Author: JIN XIAO
 * Email: xiaojin971212@gmail.com
 */
import React, { useEffect, useState } from "react";

export default function Canvas(props) {
  const { width, height, lineData, position, handleClick, handleMove } = props;
  const [ctx, setCtx] = useState(null);
  // 画线
  function drawLine(ctx) {
      console.log(ctx)
    lineData.forEach((i) => {
      ctx.strokeStyle = "#ddd";
      ctx.moveTo(i.start.x, i.start.y);
      ctx.lineTo(i.end.x, i.end.y);
      ctx.stroke();
    });
  }
// 画棋子
  function drawCircle(ctx) {
    position.forEach((i) => {
      ctx.beginPath();
      ctx.arc(i.x, i.y, 20 * 0.618, 0, Math.PI * 2);
      ctx.fillStyle = i.type ? "#e3001a" : "#000119";
      ctx.fill();
    });
  }

  useEffect(() => {
    setTimeout(() => {
      let el = document.getElementById("canvas");

      var ctxr = el.getContext("2d");
      setCtx(ctxr);
        // 兼容Retina屏
      var pixelRatio = window.devicePixelRatio || 1;
      el.style.width = el.width + "px";
      el.style.height = el.height + "px";
      el.width *= pixelRatio;
      el.height *= pixelRatio;
      ctxr.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctxr.lineWidth = 0.5;
        if (ctxr) {
            drawLine(ctxr);
            drawCircle(ctxr);
        }
    }, 0);
  }, []);
  if (ctx) {
    ctx.clearRect(0, 0, width, height);
    drawLine(ctx);
    drawCircle(ctx);
  }
  
  return (
    <canvas id="canvas" width={width} height={height} onClick={handleClick} />
  );
}
