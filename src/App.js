import React from "react";
import { useSpring, animated as a } from "react-spring";
import Container from "./Container";
import "./App.css";

const GAP = 40;
const BORDER_WIDTH = 400;
const ITEM = BORDER_WIDTH / GAP;
const LAYOUT_WIDTH = BORDER_WIDTH;

const linePositionData = [];
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
      key: +new Date() - Math.random(),
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
      key: +new Date() - Math.random(),
    });
  }
}
generateLineData();

function Line(props) {
  const { start, end } = props;
  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      strokeWidth={1}
      stroke="#ccc"
    />
  );
}

function Circle(props) {
  const { x, y, type, defaultType } = props;
  return (
    <circle
      cx={x}
      cy={y}
      r={20}
      fill={type ? "#e3001a" : "#000119"}
      style={{ opacity: defaultType ? "0.5" : "1" }}
    />
  );
}

let positions = [];

for (let index = 0; index < ITEM; index++) {
  let row = [];
  for (let j = 0; j < ITEM; j++) {
    row.push("empty");
  }
  positions.push(row);
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
    };
  }

  componentDidMount() {
    this.setState({
      svgPosition: this.board.current.getBoundingClientRect(),
    });
  }

  onMouseMove = (e) => {
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
      this.setState(
        {
          position: position.concat([
            {
              x: Math.floor((e.clientX - x) / GAP) * GAP + GAP / 2,
              y: Math.floor((e.clientY - y) / GAP) * GAP + GAP / 2,
              type: type,
              key: +new Date() - Math.random(),
            },
          ]),
          type: !type,
          step: step + 1,
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
    console.log("99", i, j, positions[i][j]);
    if (
      this.checkHorizontal(i, j) ||
      this.checkVertical(i, j) ||
      this.checkDiagonal(i, j) ||
      this.checkDiagonalReverse(i, j)
    ) {
      this.setState({
        win: true,
      });
      this.reset();
    }
  }

  checkVertical(i, j) {
    let left = j,
      right = j;
    const value = positions[i][j];
    while (true) {
      if (positions[i][left - 1] == value) left--;
      if (positions[i][right + 1] == value) right++;
      if (right - left == 4) {
        return true;
      }
      if (left == 0 || right == ITEM) {
        return false;
      }
      if (
        positions[i][left - 1] !== value &&
        positions[i][right + 1] !== value
      ) {
        return false;
      }
    }
  }

  checkHorizontal(i, j) {
    let left = i,
      right = i;
    const value = positions[i][j];
    while (true) {
      if (positions[left - 1] && positions[left - 1][j] == value) left--;
      if (positions[right + 1] && [j] == value) right++;
      if (right - left == 4) {
        return true;
      }
      if (left == 0 || right == ITEM) {
        return false;
      }
      if (
        positions[left - 1] &&
        positions[left - 1][j] !== value &&
        positions[right + 1] &&
        positions[right + 1][j] !== value
      ) {
        return false;
      }
    }
  }

  checkDiagonal(i, j) {
    let left = i,
      right = i;
    const value = positions[i][j];
    while (true) {
      if (positions[left - 1] && positions[left - 1][left - 1] == value) left--;
      if (positions[right + 1] && positions[right + 1][right + 1] == value)
        right++;
      if (right - left == 4) {
        return true;
      }
      if (left == 0 || right == ITEM) {
        return false;
      }
      if (
        positions[left - 1] &&
        positions[left - 1][left - 1] !== value &&
        positions[right + 1] &&
        positions[right + 1][right + 1] !== value
      ) {
        return false;
      }
    }
  }

  checkDiagonalReverse(i, j) {
    let left = j,
      right = j;
    const value = positions[i][j];
    while (true) {
      if (positions[left - 1] && positions[left - 1][left - 1] == value) left--;
      if (positions[right + 1] && positions[right + 1][right + 1] == value)
        right++;

      if (right - left == 4) {
        return true;
      }
      if (left == 0 || right == ITEM) {
        return false;
      }
      if (
        positions[left - 1] &&
        positions[left - 1][left - 1] !== value &&
        positions[right + 1] &&
        positions[right + 1][right + 1] !== value
      ) {
        return false;
      }
    }
  }

  reset() {
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
    });
  }

  render() {
    const { move, type, position, step, win } = this.state;
    return (
      <div className={`App ${type ? 'red':'blue'}`}>
        <Container
          win={win}
          front={<div>win</div>}
          back={
            <svg
              width={LAYOUT_WIDTH}
              height={LAYOUT_WIDTH}
              onMouseOver={this.onMouseMove}
              // onMouseMove={this.onMouseMove}
              ref={this.board}
              onClick={this.onClick}
            >
              {linePositionData.map((item) => {
                return <Line {...item} key={item.key} />;
              })}

              {[]
                .concat(position)
                .slice(0, step)
                .map((item) => {
                  return <Circle {...item} key={item.key} />;
                })}
              <Circle {...move} type={type} defaultType />
            </svg>
          }
        />

        <button
          onClick={() => {
            this.setState({
              step: step - 1,
              type: !type,
            });
          }}
          disabled={step == 0}
        >
          click
        </button>
        <button
          onClick={() => {
            this.setState({
              step: step + 1,
              type: !type,
            });
          }}
          disabled={step == position.length}
        >
          cancel
        </button>
      </div>
    );
  }
}

export default App;
