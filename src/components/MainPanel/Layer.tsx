import { getColor } from "../../utils";
import * as tf from "@tensorflow/tfjs";

export default function Layer({
  neurons,
  index,
  model,
  dispatch,
}: {
  neurons: number;
  index: number;
  model: tf.Sequential;
  dispatch: (action: any) => void;
}) {
  return (
    <div className="layer">
      <div className="header">
        <h3>{neurons + " neurons"}</h3>
        <div className="buttons">
          <button
            className="addNeuron round-button"
            onClick={() => dispatch({ type: "addNeuron", layer: index })}
          ></button>
          <button
            className="removeNeuron round-button ml-2"
            onClick={() => dispatch({ type: "removeNeuron", layer: index })}
          ></button>
        </div>
      </div>

      <div className="neurons">
        {[...Array(neurons).keys()].map((j) => {
          let bias = model.layers[index].getWeights()[1].dataSync()[j];
          let w = bias > 1 ? 1 : bias < -1 ? -1 : bias;
          return (
            <div
              className="neuron"
              key={j}
              style={{
                boxShadow: `0 0 0 0.5rem ${getColor(w, 1)}`,
              }}
            >
              {Math.round(bias * 100) / 100}
            </div>
          );
        })}
      </div>
    </div>
  );
}
