import { useState, useRef, useEffect } from "react";
import { Network } from "../Network";
import { dataset1, dataset2, dataset3 } from "../datasets";
import Modal from "./Modal";
import { getColor } from "../utils";
import "./LeftPanel.css";

const BLUE = "#6F6AF8";
const YELLOW = "#F8D06A";

type LeftPanelProps = {
  network: Network;
  dispatch: (action: any) => void;
};

export default function LeftPanel({ network, dispatch }: LeftPanelProps) {
  const [color, setColor] = useState("blue");
  const [showModal, setShowModal] = useState(false);
  const canvas1 = useRef(null);
  const canvas2 = useRef(null);

  useEffect(() => {
    //load dataset
    drawDataset();
    drawOutput();
  }, [network]);

  const drawDataset = () => {
    clearCanvas2();
    const canvas = canvas2.current! as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    for (const p of network.dataset) {
      ctx.fillStyle = p.label == "blue" ? BLUE : YELLOW;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawOutput = () => {
    clearCanvas1();
    if (network.output.length) {
      const canvas = canvas1.current! as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      let n = 0;
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          ctx.fillStyle = getColor(network.output[n] * 2 - 1, 1);
          ctx.beginPath();
          ctx.rect(50 * i, 50 * j, 50 * (i + 1), 50 * (j + 1));
          ctx.fill();
          n++;
        }
      }
    }
  };

  const clearCanvas1 = () => {
    const canvas = canvas1.current! as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const clearCanvas2 = () => {
    const canvas = canvas2.current! as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const addPoint = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = canvas2.current! as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    let dataset = JSON.parse(JSON.stringify(network.dataset));
    dataset.push({
      x: x,
      y: y,
      label: color,
    });
    dispatch({
      type: "setDataset",
      dataset: dataset,
    });
  };

  const clearDataset = () => {
    dispatch({
      type: "setDataset",
      dataset: [],
    });
  };

  const loadDataset = (i: number) => {
    const datasets = [dataset1, dataset2, dataset3];
    dispatch({
      type: "setDataset",
      dataset: datasets[i],
    });
  };

  return (
    <div className="left-panel box-section">
      <h2>Input / Output</h2>
      <p className="pt-3 text">
        Draw your own training dataset on the canvas below.
      </p>

      <div className="space-between pt-5">
        <div className="space-between">
          <button
            className={"color " + (color == "blue" ? "selected" : "")}
            onClick={() => setColor("blue")}
            id="blue"
          ></button>
          <button
            className={"color " + (color == "yellow" ? "selected" : "")}
            onClick={() => setColor("yellow")}
            id="yellow"
          ></button>
          <span className="ml-4 text">{`${
            color == "blue" ? "Blue" : "Yellow"
          } selected`}</span>
        </div>
        <button className="btn" id="clear" onClick={clearDataset}>
          Clear
        </button>
      </div>

      <div className="canvas-cont mt-5">
        <canvas id="canvas1" width="1000" height="1000" ref={canvas1}></canvas>
        <canvas
          id="canvas2"
          width="1000"
          height="1000"
          ref={canvas2}
          onClick={(e) => addPoint(e)}
        ></canvas>
      </div>

      <p className="pb-5 pt-5 text">Upload dataset presets</p>
      <div className="presets">
        <img
          className="dataset"
          src={require("../img/input1.png")}
          onClick={() => loadDataset(0)}
        />
        <img
          className="dataset"
          src={require("../img/input2.png")}
          onClick={() => loadDataset(1)}
        />
        <img
          className="dataset"
          src={require("../img/input3.png")}
          onClick={() => loadDataset(2)}
        />
      </div>

      <button
        className="mt-5 btn"
        id="upload"
        onClick={() => setShowModal(true)}
      >
        Upload from file
      </button>

      {showModal && <Modal setActive={setShowModal} dispatch={dispatch} />}
    </div>
  );
}
