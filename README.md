# Neural Network Playground

This web app provides a playground for building your own neural network for classification 2D points in the plane. 

The training of the network is implemented using Tensorflow JS library: https://www.tensorflow.org/js

Key features are:
* editing number of hidden layers (up to 5)
* editing number of neurons in each layer (up to 5)
* setting learning rate, activation function applied in hidden layers and regularization
* drawing input points in canvas or choosing a preset
* uploading input points from a .txt file
* step by step or continuous simulation of the training process (up to 9999 epochs)

App logic is divided into following core JS modules:
* **canvas.js** is dealing with rendering input and output of NN in canvas square
* **network.js** manges network topology and tensorflow model and renders UI representaion of the network
* **fileUpload.js** handles processing of input loaded from a .txt file
* **data.js** containes 3 input presets

The app is running here: https://vnovotn3.github.io/neural-network-playground/