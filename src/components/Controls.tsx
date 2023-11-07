import { Network } from "../Network";
import "./Controls.css";
import {
  EPOCHS_IN_STEP,
  EPOCHS_MAX,
  LEARNING_RATE,
  ACTIVATION,
  REGULARIZATION,
  REG_RATE,
} from "../config";

type ControlsProps = {
  network: Network;
  dispatch: (action: any) => void;
  trainingRunning: boolean;
};

export default function Controls({
  network,
  dispatch,
  trainingRunning,
}: ControlsProps) {
  return (
    <header className="controls container">
      <div>
        <button
          id="restart"
          onClick={() => dispatch({ type: "rebuildModel" })}
        ></button>
        <button
          id="play"
          className={trainingRunning ? "active" : "none"}
          onClick={() => {
            if (trainingRunning) {
              dispatch({ type: "stop" });
            } else {
              dispatch({ type: "play", epochs: EPOCHS_MAX });
            }
          }}
        ></button>
        <button
          id="step"
          onClick={() => dispatch({ type: "play", epochs: EPOCHS_IN_STEP })}
        ></button>
        <div className="pl-6">
          <span className="control-label">Epochs</span>
          <span id="epochs">{printEpochs(network.epochs)}</span>
        </div>
      </div>

      <div className="space-between gap-2">
        <Select
          label="Learning rate"
          vals={LEARNING_RATE.vals}
          labels={LEARNING_RATE.labels}
          selected={network.learningRate + ""}
          handle={(val: any) =>
            dispatch({
              type: "setLearningRate",
              learningRate: parseFloat(val),
            })
          }
        />
        <Select
          label="Activation"
          vals={ACTIVATION.vals}
          labels={ACTIVATION.labels}
          selected={network.activation}
          handle={(val: any) =>
            dispatch({
              type: "setActivation",
              activation: val,
            })
          }
        />
        <Select
          label="Regularization"
          vals={REGULARIZATION.vals}
          labels={REGULARIZATION.labels}
          selected={network.regularization}
          handle={(val: any) =>
            dispatch({
              type: "setRegularization",
              regularization: val,
            })
          }
        />
        <Select
          label="Regularization rate"
          vals={REG_RATE.vals}
          labels={REG_RATE.labels}
          selected={network.regRate + ""}
          handle={(val: any) =>
            dispatch({ type: "setRegRate", regRate: parseFloat(val) })
          }
        />
      </div>
    </header>
  );
}

function Select(props: {
  label: string;
  vals: string[];
  labels: string[];
  selected: string;
  handle: any;
}) {
  return (
    <div>
      <span className="control-label">{props.label}</span>
      <select
        className="control-input"
        value={props.selected}
        onChange={(e) => props.handle(e.target.value)}
      >
        {props.vals.map((val, i) => (
          <option value={val} key={val}>
            {props.labels[i]}
          </option>
        ))}
      </select>
    </div>
  );
}

function printEpochs(epochs: number): string {
  if (epochs == 0) {
    return "0.000";
  } else {
    return (epochs / 1000).toFixed(3);
  }
}
