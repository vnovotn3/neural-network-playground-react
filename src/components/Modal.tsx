import { useEffect, useRef, useState } from "react";
import "./Modal.css";

type ModalProps = {
  setActive: (active: boolean) => void;
  dispatch: (action: any) => void;
};

export default function Modal({ setActive, dispatch }: ModalProps) {
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    let fileIn = fileInput.current! as HTMLInputElement;
    fileIn.onchange = () => {
      if (fileIn.files!.length > 0) {
        setFileName(fileIn.files![0].name);
      }
    };
  });

  //when filereader finishes -> parse content of the file
  let fr = new FileReader();
  fr.addEventListener("load", () => {
    let data = [];
    let lines = (fr.result as string)!.split("\n");
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
    dispatch({
      type: "setDataset",
      dataset: data,
    });
    setActive(false);
  });

  //on submit -> file reader process file
  const submit = () => {
    let fileIn = fileInput.current! as HTMLInputElement;
    if (fileIn.files!.length > 0) {
      let file = fileIn.files![0];
      if (file.type == "text/plain") {
        fr.readAsText(file);
      } else {
        alert("You're only allowed to upload .txt files.");
      }
    } else {
      alert("No file selected!");
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => setActive(false)}></div>
      <div className="modal-content">
        <div className="upload-box p-5">
          <h1>Upload dataset</h1>
          <p className="pb-2 pt-4 pb-5 text">
            You can only upload .txt file with following format:
            <br />
            - Each line of the file will represent one point in the dataset.
            <br />- Each line will consist of 3 strings <b>X Y L</b> seperated
            by spaces.
            <br />- X and Y will be float numbers in interval{" "}
            <b>&lt;-500, 500&gt;</b>.<br />- L will be label of the point with
            value <b>blue</b> or <b>yellow</b>. - Example of one line:{" "}
            <i>110.5 -234.6 blue</i>
          </p>
          <div className="file has-name">
            <label className="file-label">
              <input
                className="file-input"
                id="file"
                ref={fileInput}
                type="file"
                name="resume"
              />
              <span className="file-cta"> Choose a file… </span>
              <span className="file-name">
                {fileName ? fileName : "Nothing uploaded"}
              </span>
            </label>
          </div>
          <button id="submit" className="button mt-4" onClick={submit}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
