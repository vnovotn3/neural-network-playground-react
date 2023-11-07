export default function TopPanel({
  layers,
  weights,
  biases,
  dispatch,
}: {
  layers: number;
  weights: number;
  biases: number;
  dispatch: (action: any) => void;
}) {
  return (
    <div className="space-between pb-5">
      <h2>Neural Network</h2>
      <div className="space-between gap-1">
        <div className="space-between">
          <button
            id="addLayer"
            className="round-button"
            onClick={() => dispatch({ type: "addLayer" })}
          ></button>
          <button
            id="removeLayer"
            className="round-button ml-2"
            onClick={() => dispatch({ type: "removeLayer" })}
          ></button>
        </div>
        <p className="bigger">{layers + " Hidden Layers"}</p>
      </div>
      <div className="space-between gap-1">
        <p className="text bigger">{weights + " weights"}</p>
        <p className="text bigger">{biases + " biases"}</p>
      </div>
    </div>
  );
}
