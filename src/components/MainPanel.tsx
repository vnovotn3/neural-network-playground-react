import { useEffect, useState, useRef } from "react";
import { Network } from "../Network";
import Edges from "./MainPanel/Edges";
import Layer from "./MainPanel/Layer";
import TopPanel from "./MainPanel/TopPanel";
import "./MainPanel.css";

type MainPanelprops = {
  network: Network;
  dispatch: (action: any) => void;
  trainingRunning: boolean;
};

export default function MainPanel({
  network,
  dispatch,
  trainingRunning,
}: MainPanelprops) {
  const [weights, setWeights] = useState(0);
  const [biases, setBiases] = useState(0);
  const edgesCont = useRef(null);

  useEffect(() => {
    updateStats();
  }, [network]);

  const updateStats = () => {
    let bs = network.topology.reduce((s, a) => s + a, 1);
    let ws = 0;
    for (let i = 0; i < network.topology.length; i++) {
      if (i == 0) {
        ws += 2 * network.topology[i];
      } else {
        ws += network.topology[i - 1] * network.topology[i];
      }
    }
    ws += network.topology[network.topology.length - 1];
    setWeights(ws);
    setBiases(bs);
  };

  return (
    <div className="main-panel box-section">
      <TopPanel
        layers={network.topology.length}
        weights={weights}
        biases={biases}
        dispatch={dispatch}
      />
      <div className="nn">
        <div id="layers">
          <div className="layer">
            <div className="header">
              <h3>Features</h3>
              <p className="text">coordinates of the input points</p>
            </div>

            <div className="neurons">
              <div className="neuron feature">X</div>
              <div className="neuron feature">Y</div>
            </div>
          </div>

          {network.topology.map((neurons, index) => (
            <Layer
              key={index}
              neurons={neurons}
              index={index}
              model={network.model}
              dispatch={dispatch}
            />
          ))}
        </div>
        <div
          id="edges"
          ref={edgesCont}
          className={trainingRunning ? "active" : ""}
        >
          <Edges
            topology={network.topology}
            model={network.model}
            cont={edgesCont}
          />
        </div>
      </div>
    </div>
  );
}
