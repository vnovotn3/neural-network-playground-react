import { canvas } from "./canvas.js";
import { getColor } from "./utils.js";

//network handles:
//- network topology
//- tensorflow model of the network
//- network UI

class Network {
  topology = []; //array of neurons for each layer
  model = null;
  learningRate = 0.01;
  activation = "tanh";
  regularization = "none";
  regRate = 0;
  epochs = 0;
  predict = [];
  constructor() {
    //start with 3 hidden layers
    this.addLayer();
    this.addLayer();
    this.addLayer();
    //init predict canvas
    for (let i = -500; i < 500; i += 50) {
      for (let j = -500; j < 500; j += 50) {
        this.predict.push([i, j]);
      }
    }
  }
  addLayer() {
    if (this.topology.length < 5) {
      this.topology.push(3); //add new layer with 3 neurons
      this.update();
    }
  }
  removeLayer() {
    if (this.topology.length > 1) {
      this.topology.pop();
      this.update();
    }
  }
  addNeuron(l) {
    if (this.topology[l] < 5) {
      this.topology[l]++;
      this.update();
    }
  }
  removeNeuron(l) {
    if (this.topology[l] > 1) {
      this.topology[l]--;
      this.update();
    }
  }
  //creates tensorflow model based on topology
  updateModel() {
    this.model = tf.sequential();
    for (let i = 0; i < this.topology.length; i++) {
      this.model.add(
        tf.layers.dense({
          ...(i == 0 && { inputShape: 2 }), //first layer
          ...(this.regularization == "L1" && {
            kernelRegularizer: tf.regularizers.l1({ l1: this.regRate }),
          }),
          ...(this.regularization == "L2" && {
            kernelRegularizer: tf.regularizers.l2({ l2: this.regRate }),
          }),
          units: this.topology[i],
          activation: this.activation,
        })
      );
    }
    this.model.add(
      tf.layers.dense({
        units: 1,
        activation: "sigmoid",
      })
    );
    //compile
    this.model.compile({
      optimizer: tf.train.adam(this.learningRate),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    //clear epochs and output
    this.updateEpochs(0);
    setTimeout(() => {
      canvas.clear1();
    }, 0);
  }

  updateEpochs(epochs) {
    this.epochs = epochs;
    if (epochs == 0) {
      $("#epochs").text("0.000");
    } else {
      $("#epochs").text((epochs / 1000).toFixed(3));
    }
  }

  // --------- LAYERS UI

  updateLayersUI() {
    const cont = document.querySelector("#layers");
    //empty cont
    const hidden = document.getElementsByClassName("hidden");
    while (hidden.length > 0) {
      cont.removeChild(hidden[0]);
    }
    //add layers
    for (let i = 0; i < this.topology.length; i++) {
      let newLayer = document.createElement("div");
      newLayer.classList.add("layer");
      newLayer.classList.add("hidden");
      let html = `
        <div class="header">
          <h3>${this.topology[i]} neurons</h3>
          <div class="buttons">
            <button class="addNeuron round-button" id="a${i}"></button>
            <button class="removeNeuron round-button ml-2" id="r${i}"></button>
          </div>
        </div>

        <div class="neurons">
      `;
      //add neurons
      for (let j = 0; j < this.topology[i]; j++) {
        let bias = this.model.layers[i].getWeights()[1].dataSync()[j];
        let w = bias > 1 ? 1 : bias < -1 ? -1 : bias;
        w = (w + 1) / 2;
        html += `<div class="neuron" `;
        html += `style="background-color: ${getColor(w, 1)};`;
        html += `box-shadow: 0 0 0 0.5rem ${getColor(w, 0.2)}">`;
        html += Math.round(bias * 100) / 100;
        html += `</div>`;
      }

      html += "</div>";
      newLayer.innerHTML = html;
      cont.appendChild(newLayer);
    }
    //update info
    $("#hl").text(this.topology.length + " Hidden Layers");

    let bs = this.topology.reduce((s, a) => s + a, 1);
    let ws = 0;
    for (let i = 0; i < this.topology.length; i++) {
      if (i == 0) {
        ws += 2 * this.topology[i];
      } else {
        ws += this.topology[i - 1] * this.topology[i];
      }
    }
    ws += this.topology[this.topology.length - 1];
    $("#ws").text(ws + " weights");
    $("#bs").text(bs + " biasis");
    //css
    $(".layer").css("width", `calc(90% / ${this.topology.length + 1})`);
  }

  // ---------- EDGES UI

  updateEdgesUI() {
    const remToPx = (rem) => {
      return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    };

    let top = [...this.topology];
    top.unshift(2);

    const edgesCont = document.querySelector("#edges-cont");
    const w = edgesCont.offsetWidth;
    const h = edgesCont.offsetHeight;

    let l = top.length;
    const l_w = (w * 0.9) / l;
    const m_w = (w * 0.1) / (l - 1);
    const n_w = remToPx(4.5);
    const m_h = remToPx(1);
    const n_d = l_w - n_w + m_w;

    const edges = document.querySelector("#edges");
    edges.setAttribute("width", w);
    edges.setAttribute("height", h);
    edges.setAttribute("viewBox", `0 0 ${w} ${h}`);

    $(edges).empty();

    //render SVG edges based on topology
    for (let i = 0; i < l - 1; i++) {
      for (let j = 0; j < top[i]; j++) {
        for (let k = 0; k < top[i + 1]; k++) {
          const s_x = (l_w + n_w) / 2 + i * (n_d + n_w);
          const s_y = n_w / 2 + j * (n_w + m_h);
          const e_x = s_x + n_d;
          const e_y = n_w / 2 + k * (n_w + m_h);
          const s_b_x = e_x - n_d / 2;
          const s_b_y = s_y;
          const e_b_x = s_x + n_d / 2;
          const e_b_y = e_y;

          let w = this.model.layers[i].getWeights()[0].dataSync()[
            j * top[i + 1] + k
          ];
          w = w > 1 ? 1 : w < -1 ? -1 : w;
          let s = Math.abs(w);
          w = (w + 1) / 2;

          let p = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          let d = `M ${s_x} ${s_y} C ${s_b_x} ${s_b_y}, ${e_b_x} ${e_b_y}, ${e_x} ${e_y}`;
          p.setAttribute("d", d);
          p.setAttribute("stroke", getColor(w, 0.5));
          p.setAttribute("fill", "transparent");
          p.setAttribute("stroke-width", 10 * s);
          edges.appendChild(p);
        }
      }
    }
  }

  update() {
    //stop training
    if (this.model != null) this.model.stopTraining = true;
    this.updateModel();
    this.updateLayersUI();
    this.updateEdgesUI();
  }

  // ---------- MODEL TRAINING

  async trainModel(epochs) {
    //this.model.summary();
    //this.model.layers.forEach((l) => l.getWeights()[0].print());

    //get training data from canvas
    let data = canvas.points.map((i) => [i.x - 500, i.y - 500]);
    data = tf.tensor(data);
    let labels = canvas.points.map((i) => (i.label == "green" ? 1 : 0));
    labels = tf.tensor(labels);
    //train
    await this.model.fit(data, labels, {
      epochs: epochs,
      callbacks: {
        onTrainBegin: async () => {
          //start animations and audio
          document.querySelector("audio").play();
          $("#play").toggleClass("active");
          $("#edges").toggleClass("active");
        },
        onEpochEnd: async (epoch, logs) => {
          this.updateEpochs(this.epochs + 1);
          if (this.epochs % 5 == 0) {
            //predict output and render result
            let output = this.model.predict(tf.tensor(this.predict)).dataSync();
            canvas.drawOutput(output);
            this.updateLayersUI();
            this.updateEdgesUI();
            //console.log(`Epoch ${epoch}: error: ${logs.loss}`);
          }
        },
        onTrainEnd: async () => {
          //end animations and audio
          document.querySelector("audio").pause();
          $("#play").toggleClass("active");
          $("#edges").toggleClass("active");
        },
      },
    });
  }
}

// NETWORK INIT

export const network = new Network();

//changing topology
$("#addLayer").click(() => {
  network.addLayer();
});

$("#removeLayer").click(() => {
  network.removeLayer();
});

$(document).on("click", ".addNeuron", (e) => {
  const layer = parseInt(e.target.id[1]);
  network.addNeuron(layer);
});

$(document).on("click", ".removeNeuron", (e) => {
  const layer = parseInt(e.target.id[1]);
  network.removeNeuron(layer);
});

$(window).on("load resize", function () {
  network.updateEdgesUI();
});

//changing settings
$("#learningRate").change(function () {
  network.learningRate = parseFloat(this.value);
  network.update();
});
$("#activation").change(function () {
  network.activation = this.value;
  network.update();
});
$("#regularization").change(function () {
  network.regularization = this.value;
  network.update();
});
$("#regRate").change(function () {
  network.regRate = parseFloat(this.value);
  network.update();
});

//controls
$("#step").click(() => {
  network.model.stopTraining = true;
  network.trainModel(5);
});
$("#play").click(function () {
  if ($(this).hasClass("active")) {
    network.model.stopTraining = true;
  } else {
    network.trainModel(9999);
  }
});
$("#restart").click(() => {
  network.update();
});
