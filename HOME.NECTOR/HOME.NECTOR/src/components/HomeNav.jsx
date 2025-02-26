import { useNavigate } from "react-router-dom";
import "../styles/HomeNavStyle.css";

const HomeNav = () => {
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
    <nav>
      <div className="homeTitle">
        <span style={{ color: "white" }}>HOME.</span>
        NECTOR
      </div>
      <div className="navButtonsHolder">
        {navButton("CAMERAS", "/cameras")}
        {navButton("ROBOTS", "/robots")}
        {navButton("DEVICES", "/devices")}
        {navButton("ALTERNATIVE VIEW", "/alternative_view")}
        {navButton("LEARN MORE", "/learn_more")}
      </div>
    </nav>
  );
};

export default HomeNav;
