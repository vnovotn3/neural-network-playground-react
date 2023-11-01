import { dataset1, dataset2, dataset3 } from "./data.js";
import { network } from "./network.js";
import { getColor } from "./utils.js";

//change input color
let selectedColor = "green";
const green = "#2bd180";
const yellow = "#fac132";

$("#green").click(() => {
  $("#green").addClass("selected");
  $("#yellow").removeClass("selected");
  selectedColor = "green";
});
$("#yellow").click(() => {
  $("#yellow").addClass("selected");
  $("#green").removeClass("selected");
  selectedColor = "yellow";
});

//canvas

class Canvas {
  c1 = document.querySelector("#canvas1");
  c2 = document.querySelector("#canvas2");
  points = [];
  constructor() {}
  addPoint(x, y, color) {
    this.points.push({
      x: parseInt(x),
      y: parseInt(y),
      label: color,
    });
    //draw point
    const ctx = this.c2.getContext("2d");
    ctx.fillStyle = color == "green" ? green : yellow;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fill();
    //reload model if input changes
    network.updateModel();
    this.clear1();
  }
  //clear background canvas
  clear1() {
    const ctx = this.c1.getContext("2d");
    ctx.clearRect(0, 0, this.c1.width, this.c1.height);
  }
  //clear front canvas
  clear2() {
    this.points = [];
    const ctx = this.c2.getContext("2d");
    ctx.clearRect(0, 0, this.c2.width, this.c2.height);
  }
  //load points to canvas from array
  load(data) {
    this.clear2();
    for (const p of data) {
      this.addPoint(p.x, p.y, p.label);
    }
  }
  //draw predictions of nn to background canvas
  drawOutput(data) {
    this.clear1();
    const ctx = this.c1.getContext("2d");
    let n = 0;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        ctx.fillStyle = getColor(data[n], 1);
        ctx.beginPath();
        ctx.rect(50 * i, 50 * j, 50 * (i + 1), 50 * (j + 1));
        ctx.fill();
        n++;
      }
    }
  }
}

// CNAVAS INIT

export const canvas = new Canvas();
canvas.load(dataset1);

//handle canvas click, clear and dataset loading
$("#canvas2").click((e) => {
  network.update();
  const rect = canvas.c2.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * canvas.c2.width;
  const y = ((e.clientY - rect.top) / rect.height) * canvas.c2.height;
  canvas.addPoint(x, y, selectedColor);
});
$("#clear").click(() => {
  network.update();
  canvas.clear1();
  canvas.clear2();
});
$(".dataset").click((e) => {
  network.update();
  const datasets = [dataset1, dataset2, dataset3];
  canvas.load(datasets[e.target.id[1]]);
});
