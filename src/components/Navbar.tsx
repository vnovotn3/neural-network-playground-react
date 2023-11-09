import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navigation">
      <div className="container space-between">
        <a className="logo" href="/neural-network-playground-react/">
          Neural Network Playground
        </a>
        <p className="middle">
          Made with{" "}
          <a href="https://react.dev/" target="_blank">
            React
          </a>
          ,{" "}
          <a href="https://www.typescriptlang.org/" target="_blank">
            TypeScript
          </a>{" "}
          and{" "}
          <a href="https://www.tensorflow.org/" target="_blank">
            TensorFlow
          </a>{" "}
          by Vojtěch Novotný
        </p>
        <div className="space-between gap-1">
          <a
            href="https://github.com/vnovotn3/neural-network-playground-react"
            target="_blank"
          >
            GitHub repo
          </a>
          <a
            href="https://www.linkedin.com/in/vojtech-novotny-83134277"
            className="btn"
          >
            Hire me
          </a>
        </div>
      </div>
    </nav>
  );
}
