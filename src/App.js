import React from "react";
import { useSpring, animated as a } from "react-spring";
import Container from "./Container";
import CanvasVersion from "./Canvas";
import "./App.css";

const GAP = 40;
const BORDER_WIDTH = 400;
const ITEM = BORDER_WIDTH / GAP;
const LAYOUT_WIDTH = BORDER_WIDTH;

const linePositionData = [];
const generateKey = (pre) => {
  return `${pre}_${Math.random(9)}`;
};
function generateLineData() {
  for (let j = 0; j < ITEM + 1; j++) {
    linePositionData.push({
      start: {
        x: 0,
        y: j * GAP,
      },
      end: {
        x: BORDER_WIDTH,
        y: j * GAP,
      },
      key: generateKey("x"),
    });
    linePositionData.push({
      start: {
        x: j * GAP,
        y: 0,
      },
      end: {
        x: j * GAP,
        y: BORDER_WIDTH,
      },
      key: generateKey("y"),
    });
  }
}
generateLineData(linePositionData);

console.log(linePositionData);

function Line(props) {
  const { start, end } = props;
  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      strokeWidth={1}
      stroke="#ddd"
    />
  );
}

function Circle(props) {
  const { x, y, type, defaultType } = props;
  return (
    <circle
      cx={x}
      cy={y}
      r={20 * 0.618}
      fill={type ? "#e3001a" : "#000119"}
      style={{ opacity: defaultType ? "0.5" : "1" }}
    />
  );
}

let positions = [];

for (let index = 0; index < ITEM+1; index++) {
  let row = [];
  for (let j = 0; j < ITEM+1; j++) {
    row.push("empty");
  }
  positions.push(row);
}

function checkHorizontal(i, j) {
  let left = i,
    right = i;
  const value = positions[i][j];
  let flag = false;
  let index = 0;
  while (index <= 5) {
    if (positions[left - 1] && positions[left - 1][j] == value) {
      left--;
    }
    if (positions[right + 1] && positions[right + 1][j] == value) {
      right++;
    }
    if (left == right) {
      break;
    }
    if (
      positions[left - 1] &&
      positions[left - 1][j] !== value &&
      positions[right + 1] &&
      positions[right + 1][j] !== value
    ) {
      break;
    }
    if ((left > 0 && left < ITEM - 1) && (right > 0 && right < ITEM - 1)) {
      if (right - left >= 3) {
        flag = true;
        break;
      }
    } else {
      if (right - left >= 4) {
        flag = true;
        break;
      }
    }
    
    index++;
  }
  return flag;
}

function checkDiagonal(i, j) {
  let left = i,
    top = j,
    right = i,
    bottom = j;
  const value = positions[i][j];
  let flag = false;
  let index = 0;
  while (index <= 5) {
    if (positions[left - 1] && positions[left - 1][bottom + 1] == value) {
      left--;
      bottom++;
    }
    if (positions[right + 1] && positions[right + 1][top - 1] == value) {
      right++;
      top--;
    }
    if (
      positions[left - 1] &&
      positions[left - 1][bottom + 1] !== value &&
      positions[right + 1] &&
      positions[right + 1][top - 1] !== value
    ) {
      break;
    }
    if ((left > 0 && left < ITEM - 1) && (right > 0 && right < ITEM - 1)) {
      if (right - left >= 3) {
        flag = true;
        break;
      }
    } else {
      if (right - left >= 4) {
        flag = true;
        break;
      }
    }
    index++;
  }
  return flag;
}

function checkDiagonalReverse(i, j) {
  let left = i,
    top = j,
    right = i,
    bottom = j;
  const value = positions[i][j];
  let flag = false;
  let index = 0;
  while (index <= 5) {
    if (positions[left - 1] && positions[left - 1][top - 1] == value) {
      left--;
      top--;
    }
    if (positions[right + 1] && positions[right + 1][bottom + 1] == value) {
      right++;
      bottom++;
    }
    if (
      positions[left - 1] && positions[left - 1][top - 1] != value &&
      positions[right + 1] && positions[right + 1][bottom + 1] != value
    ) {
      break;
    }
    if ((left > 0 && left < ITEM - 1) && (right > 0 && right < ITEM - 1)) {
      if (right - left >= 3) {
        flag = true;
        break;
      }
    } else {
      if (right - left >= 4) {
        flag = true;
        break;
      }
    }

    index++;
  }
  return flag;
}

function checkVertical(i, j) {
  let left = j,
    right = j;
  const value = positions[i][j];
  let flag = false;
  let index = 0;
  while (index <= 5) {
    if (positions[i][left - 1] == value) left--;
    if (positions[i][right + 1] == value) right++;
    if (left == right) {
      break;
    }
    if (positions[i][left - 1] !== value && positions[i][right + 1] !== value) {
      break;
    }
    if ((left > 0 && left < ITEM - 1) && (right > 0 && right < ITEM - 1)) {
      if (right - left >= 3) {
        flag = true;
        break;
      }
    } else {
      if (right - left >= 4) {
        flag = true;
        break;
      }
    }
    index++;
  }
  return flag;
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.board = React.createRef();
    this.state = {
      svgPosition: {
        x: 0,
        y: 0,
      },
      move: {
        x: GAP / 2,
        y: GAP / 2,
      },
      position: [],
      type: true,
      step: 0,
      win: false,
      newest: {
        x: GAP / 2,
        y: GAP / 2,
      },
      regret: false,
      dirty: false,
      canvas: false,
    };
  }

  componentDidMount() {
    this.setState({
      svgPosition: this.board.current.getBoundingClientRect(),
    });
    window.addEventListener('resize', () => {
      this.setState({
        svgPosition: this.board.current.getBoundingClientRect(),
      });
    })
  }

  onMouseMove = (e) => {
    // const throttle = (func, limit) => {
    //   let inThrottle
    //   return function() {
    //     const args = arguments
    //     const context = this
    //     if (!inThrottle) {
    //       func.apply(context, args)
    //       inThrottle = true
    //       setTimeout(() => inThrottle = false, limit)
    //     }
    //   }
    // }
    const {
      svgPosition: { x, y },
    } = this.state;
    this.setState({
      move: {
        x: Math.floor((e.clientX - x) / GAP) * GAP + GAP / 2,
        y: Math.floor((e.clientY - y) / GAP) * GAP + GAP / 2,
      },
    });
  };

  onClick = (e) => {
    const {
      type,
      position,
      svgPosition: { x, y },
      step,
    } = this.state;
    if (
      positions[Math.floor((e.clientX - x) / GAP)][
        Math.floor((e.clientY - y) / GAP)
      ] == "empty"
    ) {
      positions[Math.floor((e.clientX - x) / GAP)][
        Math.floor((e.clientY - y) / GAP)
      ] = type;
      const i = Math.floor((e.clientX - x) / GAP);
      const j = Math.floor((e.clientY - y) / GAP);
      const newPosition = position;
      newPosition.push({
        x: Math.floor((e.clientX - x) / GAP) * GAP + GAP / 2,
        y: Math.floor((e.clientY - y) / GAP) * GAP + GAP / 2,
        type: type,
        key: generateKey("position"),
      });
      this.setState(
        {
          position: newPosition,
          type: !type,
          step: step + 1,
          newest: {
            x: i,
            y: j,
          },
          regret: false,
          dirty: true,
        },
        () => {
          this.check(i, j);
        }
      );
    } else {
      console.log("o");
    }
  };

  check(i, j) {
    const a = checkHorizontal(i, j);
    const b = checkDiagonal(i, j);
    const c = checkVertical(i, j);
    const d = checkDiagonalReverse(i, j);
    if (a || c || b || d) {
      this.setState({
        win: true,
        dirty: false
      });
      // this.reset();
    }
  }

  reset = () => {
    positions = [];
    for (let index = 0; index < ITEM; index++) {
      let row = [];
      for (let j = 0; j < ITEM; j++) {
        row.push("empty");
      }
      positions.push(row);
    }
    this.setState({
      position: [],
      type: true,
      step: 0,
      win: false,
      newest: {
        x: GAP / 2,
        y: GAP / 2,
      },
      regret: false,
      dirty: false,
    });
  };

  handleRegret = () => {
    const { step, type, position, regret } = this.state;
    if (step > 0 && !regret) {
      positions[this.state.newest.x][this.state.newest.y] = "empty";
      this.setState({
        step: step - 1,
        type: !type,
        position: position.filter((item, index) => index < step - 1),
        regret: true,
        cur: !type,
      });
    }
  };
  handleCancel = () => {
    const { step, type, position, regret } = this.state;
    if (regret) {
      positions[this.state.newest.x][this.state.newest.y] = type;
      const newPosition = position;
      newPosition.push({
        x: this.state.newest.x * GAP + GAP / 2,
        y: this.state.newest.y * GAP + GAP / 2,
        type: type,
        key: generateKey("position"),
      });
      this.setState({
        step: step + 1,
        type: !type,
        position: newPosition,
        regret: false,
      });
    }
  };

  render() {
    const {
      move,
      type,
      position,
      step,
      win,
      regret,
      dirty,
      cur,
      canvas,
    } = this.state;
    return (
      <div className={`App`}>
        <div className="wrapper">
          <div className="row">
            <img src={require("./assets/1.png")} alt="" />
            <img src={require("./assets/5.png")} alt="" className="logo"/>
            <img src={require("./assets/2.png")} alt="" />
          </div>
          <div className="container">
            <div className={`left ${(cur !== true && regret) ? "disableSection" : ""}`}>
              <div className={`player ${type ? "active" : ""}`}></div>
              <button
                className={`button red ${
                  dirty ? (type ? "disable" : "") : "disable"
                }`}
                onClick={this.handleRegret}
              >
                REGRET
              </button>
              <button
                className={`button red ${
                  dirty ? (!regret ? "disable" : "") : "disable"
                }`}
                onClick={this.handleCancel}
              >
                CANCEL
              </button>
            </div>
            <Container
              win={!win}
              front={
                <div className={`winContainer ${!type ? "redBg" : "blueBg"}`}>
                  <h2 className={`${!type ? "redCl" : "blueCl"}`}>
                    {!type ? "RED PLAYER" : "BLACK PLAYER"} WIN!
                  </h2>
                  <button
                    className={`button ${!type ? "red" : "blue"}`}
                    onClick={this.reset}
                  >
                    RESET
                  </button>
                </div>
              }
              back={
                <div className="board">
                  {canvas ? (
                    <CanvasVersion
                      width={LAYOUT_WIDTH}
                      height={LAYOUT_WIDTH}
                      lineData={linePositionData}
                      position={position}
                      handleClick={this.onClick}
                      handleMove={this.onMouseMove}
                    />
                  ) : (
                    <svg
                      width={LAYOUT_WIDTH}
                      height={LAYOUT_WIDTH}
                      onMouseMove={this.onMouseMove}
                      onMouseEnter={this.onMouseMove}
                      ref={this.board}
                      onClick={this.onClick}
                    >
                      {linePositionData.map((item) => {
                        return <Line {...item} key={item.key} />;
                      })}

                      {position.map((item) => {
                        return <Circle {...item} key={item.key} />;
                      })}
                      <Circle {...move} type={type} defaultType />
                    </svg>
                  )}
                </div>
              }
            />
            <div className={`right ${(cur !== false && regret) ? "disableSection" : ""}`}>
              <div className={`player ${!type ? "active" : ""}`}></div>

              <button
                className={`button blue ${
                  dirty ? (!type ? "disable" : "") : "disable"
                }`}
                onClick={this.handleRegret}
              >
                REGRET
              </button>
              <button
                className={`button blue ${
                  dirty ? (!regret ? "disable" : "") : "disable"
                }`}
                onClick={this.handleCancel}
              >
                CANCEL
              </button>
            </div>
          </div>

          <div className="row">
            <img src={require("./assets/3.png")} alt="" />
            <button
              className="button switch"
              onClick={() => {
                this.setState({
                  canvas: !canvas,
                });
              }}
            >
              {canvas ? "CANVAS" : "DOM"}
            </button>
            <img src={require("./assets/4.png")} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
