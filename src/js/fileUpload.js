import { canvas } from "./canvas.js";
import { network } from "./network.js";

//show modal
$("#upload").click(() => {
  $(".modal").toggleClass("is-active");
});
//hide modal
$(".modal-background").click(() => {
  $(".modal").toggleClass("is-active");
});
//show uploaded file name
const fileInput = document.querySelector("#file");
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector(".file-name");
    fileName.textContent = fileInput.files[0].name;
  }
};

//when filereader finishes -> parse content of the file
let fr = new FileReader();
fr.addEventListener("load", () => {
  let data = [];
  let lines = fr.result.split("\n");
  for (let line of lines) {
    let words = line.split(" ");
    if (words.length == 3) {
      let x = parseFloat(words[0]);
      let y = parseFloat(words[1]);
      let label = words[2];
      //check data format
      if (
        !isNaN(x) &&
        !isNaN(y) &&
        x >= -500 &&
        x <= 500 &&
        y >= -500 &&
        y <= 500 &&
        (label == "green" || label == "yellow")
      ) {
        data.push({ x: x + 500, y: y + 500, label: label });
      } else {
        alert("Provided file is malformed.");
        return;
      }
    }
  }
  //upload dataset to canvas
  network.update();
  canvas.load(data);
  $(".modal").toggleClass("is-active");
});

//on submit -> file reader process file
$("#submit").click(() => {
  if (fileInput.files.length > 0) {
    let file = fileInput.files[0];
    if (file.type == "text/plain") {
      fr.readAsText(file);
    } else {
      alert("You're only allowed to upload .txt files.");
    }
  } else {
    alert("No file selected!");
  }
});
