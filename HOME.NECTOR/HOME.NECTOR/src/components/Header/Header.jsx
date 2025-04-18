import { useNavigate } from "react-router-dom";
import "./HeaderStyle.css";

export default function Header() {
  const navigate = useNavigate();

  const goToSubsite = (address) => {
    navigate(address);
  };

  const navButton = (text, address) => {
    return (
      <button
        type="button"
        className="navButton"
        onClick={() => goToSubsite(address)}
      >
        {text}
      </button>
    );
  };

  return (
    <header className="header">
      <button type="button" onClick={() => goToSubsite("/")}>
        <div className="headerTitle">
          <span className="text-white">HOME.</span>
          NECTOR
        </div>
      </button>
      <div className="navButtonsHolder">
        {navButton("CAMERAS", "/cameras")}
        {navButton("ROBOTS", "/robots")}
        {navButton("DEVICES", "/devices")}
        {navButton("ALTERNATIVE VIEW", "/alternative_view")}
        {navButton("LEARN MORE", "/learn_more")}
        {navButton("SETTINGS", "/learn_more")}
      </div>
    </header>
  );
}
