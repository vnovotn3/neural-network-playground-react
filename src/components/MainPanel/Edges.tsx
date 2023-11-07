import { useEffect, useState } from "react";
import { getColor, remToPx } from "../../utils";
import * as tf from "@tensorflow/tfjs";

const STROKE_WIDTH = 10;

export default function Edges({
  topology,
  model,
  cont,
}: {
  topology: number[];
  model: tf.Sequential;
  cont: React.MutableRefObject<null>;
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFullHD, setFullHD] = useState(window.innerWidth > 1407);
  const [edges, setEdges] = useState([] as JSX.Element[]);
  const [contWidth, setContWidth] = useState(0);
  const [contHeight, setContHeight] = useState(0);

  //update window width when resize
  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
  }, []);

  //update isFullHD when window width changes
  useEffect(() => {
    if (windowWidth > 1407 && !isFullHD) {
      setFullHD(true);
    } else if (windowWidth <= 1407 && isFullHD) {
      setFullHD(false);
    }
  }, [windowWidth, isFullHD]);

  //update cont sizes when isFullHD changes
  useEffect(() => {
    if (cont.current) {
      const c = cont.current! as HTMLDivElement;
      setContWidth(c.offsetWidth);
      setContHeight(c.offsetHeight);
    }
  }, [cont, isFullHD]);

  //rerender edges
  useEffect(() => {
    let top = [...topology];
    top.unshift(2);
    let layers_total = top.length;
    const layer_gap_w = remToPx(isFullHD ? 1.5 : 1);
    const layer_w =
      (contWidth - (layers_total - 1) * layer_gap_w) / layers_total;
    const neuron_w = remToPx(4.5);
    const m_h = remToPx(1);
    const neuron_dist = layer_w - neuron_w + layer_gap_w;

    let edgesArray: JSX.Element[] = [];
    for (let i = 0; i < layers_total - 1; i++) {
      for (let j = 0; j < top[i]; j++) {
        for (let k = 0; k < top[i + 1]; k++) {
          const start_x =
            (layer_w + neuron_w) / 2 + i * (neuron_dist + neuron_w);
          const start_y = neuron_w / 2 + j * (neuron_w + m_h);
          const end_x = start_x + neuron_dist;
          const end_y = neuron_w / 2 + k * (neuron_w + m_h);
          const start_b_x = end_x - neuron_dist / 2;
          const start_b_y = start_y;
          const end_b_x = start_x + neuron_dist / 2;
          const end_b_y = end_y;

          let weight = model.layers[i].getWeights()[0].dataSync()[
            j * top[i + 1] + k
          ];
          weight = weight > 1 ? 1 : weight < -1 ? -1 : weight;
          let stroke = Math.abs(weight);

          let path = `M ${start_x} ${start_y} C ${start_b_x} ${start_b_y}, ${end_b_x} ${end_b_y}, ${end_x} ${end_y}`;
          edgesArray.push(
            <path
              d={path}
              stroke={getColor(weight, 0.6)}
              fill="transparent"
              strokeWidth={STROKE_WIDTH * stroke}
              key={100 * i + 10 * j + k}
            />
          );
        }
      }
    }
    setEdges(edgesArray);
  }, [isFullHD, topology, model, contWidth]);

  return (
    <svg
      width={contWidth}
      height={contHeight + STROKE_WIDTH}
      viewBox={`0 0 ${contWidth} ${contHeight + STROKE_WIDTH}`}
    >
      {edges}
    </svg>
  );
}
