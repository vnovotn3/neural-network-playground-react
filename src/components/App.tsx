import { useReducer, useState, useRef } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Controls from "./Controls";
import LeftPanel from "./LeftPanel";
import MainPanel from "./MainPanel";
import { dataset1 } from "../datasets";
import {
  initNetwork,
  trainModel,
  updateModel,
  rebuildModel,
  getModel,
  addLayer,
  removeLayer,
  addNeuron,
  removeNeuron,
} from "../Network";
import type { Dataset, Network } from "../Network";
import * as tf from "@tensorflow/tfjs";
import type { Tensor } from "@tensorflow/tfjs-core";
import type { ActivationIdentifier } from "@tensorflow/tfjs-layers/dist/keras_format/activation_config.js";

type Action = {
  type: string;
  output?: number[];
  epochs?: number;
  weights?: Tensor[];
  regRate?: number;
  regularization?: string;
  activation?: ActivationIdentifier;
  learningRate?: number;
  dataset?: Dataset;
  layer?: number;
};

const networkReducer = (network: Network, action: Action): Network => {
  switch (action.type) {
    case "setOutput":
      return { ...network, output: action.output! };
    case "setEpochs":
      return { ...network, epochs: action.epochs! };
    case "updateModel":
      return updateModel(network, action.weights!);
    case "rebuildModel":
      return rebuildModel(network);
    case "addLayer":
      return addLayer(network);
    case "removeLayer":
      return removeLayer(network);
    case "addNeuron":
      return addNeuron(network, action.layer!);
    case "removeNeuron":
      return removeNeuron(network, action.layer!);
    case "setRegRate":
      return {
        ...rebuildModel(network),
        regRate: action.regRate!,
      };
    case "setRegularization":
      return {
        ...rebuildModel(network),
        regularization: action.regularization!,
      };
    case "setActivation":
      return {
        ...rebuildModel(network),
        activation: action.activation! as ActivationIdentifier,
      };
    case "setLearningRate":
      return {
        ...rebuildModel(network),
        learningRate: action.learningRate!,
      };
    case "setDataset":
      return {
        ...rebuildModel(network),
        output: [],
        dataset: action.dataset!,
      };
  }
  return network;
};

export default function App() {
  const [network, dispatchNetwork] = useReducer(
    networkReducer,
    null,
    initNetwork
  );
  const [trainingRunning, setTrainingRunning] = useState(false);
  const model = useRef(tf.sequential());

  const dispatchControls = async (action: Action) => {
    //first stop training before changing settings
    //if changing settings while training wait for sync
    if (model.current.optimizer) model.current.stopTraining = true;
    if (trainingRunning) {
      await new Promise((res) => setTimeout(res, 500));
    }

    switch (action.type) {
      case "play":
        model.current = getModel(network);
        let dataset = network.dataset;
        //if dataset empty -> set the first preset
        if (!dataset.length) {
          dataset = dataset1;
          dispatchNetwork({
            type: "setDataset",
            dataset: dataset,
          });
        }
        trainModel(
          model.current,
          dataset,
          network.epochs,
          action.epochs!,
          setTrainingRunning,
          dispatchNetwork
        );
        break;
      case "stop":
        break;
      default:
        dispatchNetwork(action);
        break;
    }
  };

  return (
    <div className="pb-4">
      <Navbar />
      <Controls
        network={network}
        dispatch={dispatchControls}
        trainingRunning={trainingRunning}
      />
      <main className="container pb-6">
        <div className="space-between gap-2 stretch">
          <LeftPanel network={network} dispatch={dispatchControls} />
          <MainPanel
            network={network}
            dispatch={dispatchControls}
            trainingRunning={trainingRunning}
          />
        </div>
      </main>
    </div>
  );
}
