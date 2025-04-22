import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HeaderStyle.css";

export default function Header() {
  const [texts, setTexts] = useState(null);

  useEffect(() => {
    const lang = localStorage.getItem("lang") ?? "en";
    console.log("LANG => ", lang);
    fetch(`/locals/header-locals/${lang}-texts.json`)
      .then((response) => response.json())
      .then((data) => {
        setTexts(data);
        console.log(data);
      })
      .catch((error) => console.log("Loading texts file error: ", error));
  }, []);

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
        {texts ? (
          <>
            {navButton(
              texts.header_cameras_btn || "Text not found",
              "/cameras"
            )}
            {navButton(texts.header_robots_btn || "Text not found", "/robots")}
            {navButton(
              texts.header_devices_btn || "Text not found",
              "/devices"
            )}
            {navButton(
              texts.header_alternative_view_btn || "Text not found",
              "/alternative_view"
            )}
            {navButton(
              texts.header_learnmore_btn || "Text not found",
              "/learn_more"
            )}
            {navButton(
              texts.header_settings_btn || "Text not found",
              "/learn_more"
            )}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </header>
  );
}
