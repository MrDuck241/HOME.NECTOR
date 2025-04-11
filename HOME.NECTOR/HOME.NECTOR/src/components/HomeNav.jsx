import { useNavigate } from "react-router-dom";
import "../components_styles/HomeNavStyle.css";

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
    <div className="homeNav">
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
        {navButton("LANGUAGE", "/learn_more")}
      </div>
    </div>
  );
};

export default HomeNav;
