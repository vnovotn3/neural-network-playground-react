import * as tf from "@tensorflow/tfjs";
import type { Tensor } from "@tensorflow/tfjs-core";
import type { ActivationIdentifier } from "@tensorflow/tfjs-layers/dist/keras_format/activation_config.js";
import { dataset1 } from "./datasets";
import { INIT_TOPOLOGY } from "./config";

export type Network = {
  topology: number[];
  model: tf.Sequential;
  dataset: Dataset;
  output: number[];
  learningRate: number;
  activation: ActivationIdentifier;
  regularization: string;
  regRate: number;
  epochs: number;
};

export type Dataset = {
  x: number;
  y: number;
  label: string;
}[];

export function initNetwork(): Network {
  let network = {
    topology: [] as number[],
    model: tf.sequential(),
    dataset: dataset1,
    output: [] as number[],
    learningRate: 0.01,
    activation: "tanh" as ActivationIdentifier,
    regularization: "none",
    regRate: 0,
    epochs: 0,
  };
  for (let i = 0; i < INIT_TOPOLOGY.length; i++) {
    network = addLayer(network, INIT_TOPOLOGY[i]);
  }
  return network;
}

export function addLayer(network: Network, neurons?: number): Network {
  if (network.topology.length < 5) {
    network = rebuildModel({
      ...network,
      topology: [...network.topology, neurons ? neurons : 3],
    });
  }
  return { ...network };
}

export function removeLayer(network: Network): Network {
  if (network.topology.length > 1) {
    network = rebuildModel({
      ...network,
      topology: network.topology.slice(0, -1),
    });
  }
  return { ...network };
}

export function addNeuron(network: Network, layer: number): Network {
  if (network.topology[layer] < 5) {
    let topology = [...network.topology];
    topology[layer]++;
    network = rebuildModel({ ...network, topology: topology });
  }
  return { ...network };
}

export function removeNeuron(network: Network, layer: number): Network {
  if (network.topology[layer] > 1) {
    let topology = [...network.topology];
    topology[layer]--;
    network = rebuildModel({ ...network, topology: topology });
  }
  return { ...network };
}

export function getModel(network: Network): tf.Sequential {
  const model = buildModelFromTopology(network);
  model.setWeights(network.model.getWeights());
  return model;
}

export function updateModel(network: Network, weights: Tensor[]): Network {
  const model = buildModelFromTopology(network);
  model.setWeights(weights);
  return { ...network, model: model };
}

export function rebuildModel(network: Network): Network {
  const model = buildModelFromTopology(network);
  return { ...network, model: model, output: [], epochs: 0 };
}

function buildModelFromTopology(network: Network): tf.Sequential {
  const model = tf.sequential();
  for (let i = 0; i < network.topology.length; i++) {
    model.add(
      tf.layers.dense({
        ...(i == 0 && { inputShape: [2] }), //first layer
        ...(network.regularization == "L1" && {
          kernelRegularizer: tf.regularizers.l1({ l1: network.regRate }),
        }),
        ...(network.regularization == "L2" && {
          kernelRegularizer: tf.regularizers.l2({ l2: network.regRate }),
        }),
        units: network.topology[i],
        activation: network.activation,
      })
    );
  }
  model.add(
    tf.layers.dense({
      units: 1,
      activation: "sigmoid",
    })
  );
  //compile
  model.compile({
    optimizer: tf.train.adam(network.learningRate),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });
  return model;
}

export async function trainModel(
  model: tf.Sequential,
  dataset: Dataset,
  epochsTotal: number,
  epochs: number,
  setTrainingRunning: any,
  dispatchNetwork: any
) {
  //prepare predict
  let predict: [number, number][] = [];
  for (let i = -500; i < 500; i += 50) {
    for (let j = -500; j < 500; j += 50) {
      predict.push([i, j]);
    }
  }

  //get training data from canvas
  let data = dataset.map((i) => [i.x - 500, i.y - 500]);
  let tensor_data = tf.tensor(data);
  let labels = dataset.map((i) => (i.label == "blue" ? 1 : 0));
  let tensor_labels = tf.tensor(labels);
  //train
  await model!.fit(tensor_data, tensor_labels, {
    epochs: epochs,
    callbacks: {
      onTrainBegin: async () => {
        setTrainingRunning(true);
      },
      onEpochEnd: async (epoch, logs) => {
        epochsTotal += 1;
        dispatchNetwork({ type: "setEpochs", epochs: epochsTotal });
        dispatchNetwork({ type: "updateModel", weights: model.getWeights() });
        if (epochsTotal % 5 == 0) {
          //predict output
          let output = (
            model!.predict(tf.tensor(predict)) as tf.Tensor
          ).dataSync();
          dispatchNetwork({ type: "setOutput", output: output });
        }
      },
      onTrainEnd: async () => {
        setTrainingRunning(false);
      },
    },
  });
}
