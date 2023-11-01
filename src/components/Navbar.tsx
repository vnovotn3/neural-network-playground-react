import { useState } from "react";
import "./Navbar.css";

function Link({ title, url }: { title: string; url: string }) {
  return (
    <a href={url} target="_blank" className="navbar-item">
      {title}
    </a>
  );
}

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item logo" href="/">
            <p>Neural Network Playground</p>
          </a>

          <a
            role="button"
            className={"navbar-burger " + (showMenu ? "is-active" : "")}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={"navbar-menu " + (showMenu ? "is-active" : "")}>
          <div className="navbar-end">
            <Link
              title="About Neural Networks"
              url="https://www.youtube.com/watch?v=aircAruvnKk"
            />
            <Link title="TensorFlow" url="https://www.tensorflow.org/" />
            <Link
              title="GitHub repo"
              url="https://github.com/vnovotn3/neural-network-playground"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
