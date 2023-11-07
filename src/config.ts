export const EPOCHS_IN_STEP = 5;
export const EPOCHS_MAX = 9999;
export const INIT_TOPOLOGY = [3, 4, 3];
export const LEARNING_RATE = {
  vals: ["0.0001", "0.001", "0.01", "0.1", "1"],
  labels: ["0.0001", "0.001", "0.01", "0.1", "1"],
};
export const ACTIVATION = {
  vals: ["relu", "tanh", "sigmoid", "linear"],
  labels: ["ReLU", "Tanh", "Sigmoid", "Linear"],
};
export const REGULARIZATION = {
  vals: ["none", "L1", "L2"],
  labels: ["None", "L1", "L2"],
};
export const REG_RATE = {
  vals: ["0", "0.001", "0.01", "0.1", "1"],
  labels: ["0", "0.001", "0.01", "0.1", "1"],
};
