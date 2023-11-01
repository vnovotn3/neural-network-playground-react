import React from "react";
import "./css/main.css";
import "./css/bulma.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <header className="controls container">
        <div>
          <button id="restart">
            <img src="img/restart.svg" alt="restart" />
          </button>
          <button id="play"></button>
          <button id="step">
            <img src="img/next.svg" alt="next" />
          </button>
          <div className="pl-6 epochs-cont">
            <span className="control-label">Epochs</span>
            <span id="epochs">0.000</span>
          </div>
        </div>

        <div className="left">
          <div>
            <span className="control-label">Learning rate</span>
            <select className="control-input" id="learningRate">
              <option value="0.0001">0.0001</option>
              <option value="0.001">0.001</option>
              <option value="0.01" selected>
                0.01
              </option>
              <option value="0.1">0.1</option>
              <option value="1">1</option>
            </select>
          </div>
          <div className="pl-6">
            <span className="control-label">Activation</span>
            <select className="control-input" id="activation">
              <option value="relu">ReLU</option>
              <option value="tanh" selected>
                Tanh
              </option>
              <option value="sigmoid">Sigmoid</option>
              <option value="linear">Linear</option>
            </select>
          </div>
          <div className="pl-6">
            <span className="control-label">Regularization</span>
            <select className="control-input" id="regularization">
              <option value="none" selected>
                None
              </option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
            </select>
          </div>
          <div className="pl-6">
            <span className="control-label">Regularization rate</span>
            <select className="control-input" id="regRate">
              <option value="0" selected>
                0
              </option>
              <option value="0.001">0.001</option>
              <option value="0.01">0.01</option>
              <option value="0.1">0.1</option>
              <option value="1">1</option>
            </select>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="columns is-multiline">
          <div className="column is-full-mobile is-full-tablet is-full-desktop is-narrow-widescreen">
            <section className="left-panel box-section">
              <div className="mobile">
                <div className="left pr-4"></div>
                <div className="right pl-4"></div>
              </div>
              <div className="top">
                <h2>Input / Output</h2>
                <p className="pt-3">
                  Create your own dataset by placing new points on the canvas.
                  First, for each point, select its label color.
                </p>
              </div>
              <div className="middle">
                <div className="canvas-cont mt-5">
                  <canvas id="canvas1" width="1000" height="1000">
                    {" "}
                  </canvas>
                  <canvas id="canvas2" width="1000" height="1000">
                    {" "}
                  </canvas>
                </div>
                <div className="space-between pt-4">
                  <div>
                    <button className="color selected" id="green"></button>
                    <button className="color" id="yellow"></button>
                    <span className="ml-4">Input color</span>
                  </div>
                  <button id="clear">Clear</button>
                </div>
              </div>
              <div className="bottom">
                <p className="pb-5 pt-5">
                  You can also select a dataset from the presets below or upload
                  it from file.
                </p>
                <div className="presets">
                  <img
                    className="dataset"
                    id="d0"
                    src="img/input1.png"
                    alt="dataset 0"
                  />
                  <img
                    className="dataset"
                    id="d1"
                    src="img/input2.png"
                    alt="dataset 1"
                  />
                  <img
                    className="dataset"
                    id="d2"
                    src="img/input3.png"
                    alt="dataset 2"
                  />
                </div>
                <button id="upload" className="mt-5">
                  Upload from file
                </button>
              </div>
            </section>
          </div>

          <div className="column">
            <section className="main-panel box-section">
              <div className="space-between pb-5">
                <h2>Neural Network</h2>
                <div className="space-between">
                  <button id="addLayer" className="round-button"></button>
                  <button
                    id="removeLayer"
                    className="round-button ml-2"
                  ></button>
                  <p className="ml-4" id="hl">
                    2 Hidden Layers
                  </p>
                </div>
                <div className="space-between">
                  <p id="ws"></p>
                  <p className="ml-4" id="bs"></p>
                </div>
              </div>
              <div className="nn">
                <div id="layers">
                  <div className="layer">
                    <div className="header">
                      <h3>Features</h3>
                      <p>coordinates of the input points</p>
                    </div>

                    <div className="neurons">
                      <div className="neuron feature">X</div>
                      <div className="neuron feature">Y</div>
                    </div>
                  </div>
                </div>
                <div id="edges-cont">
                  <svg id="edges"></svg>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="upload-box p-5">
            <h1>Upload dataset</h1>
            <p className="pb-2 pt-4 pb-5">
              You can only upload .txt file with following format:
              <br />
              - Each line of the file will represent one point in the dataset.
              <br />- Each line will consist of 3 strings <b>X Y L</b> seperated
              by spaces.
              <br />- X and Y will be float numbers in interval
              <b>&lt;-500, 500&gt;</b>.<br />- L will be label of the point with
              value <b>green</b> or
              <b>yellow</b>. - Example of one line: <i>110.5 -234.6 green</i>
            </p>
            <div className="file has-name">
              <label className="file-label">
                <input
                  className="file-input"
                  id="file"
                  type="file"
                  name="resume"
                />
                <span className="file-cta"> Choose a file… </span>
                <span className="file-name"> Nothing uploaded </span>
              </label>
            </div>
            <button id="submit" className="button mt-4">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
