import { useEffect, useState } from "react";
import "./HomeStyle.css";

const HomeMain = () => {
  const [texts, setTexts] = useState(null);

  useEffect(() => {
    const lang = localStorage.getItem("lang") ?? "en";
    console.log("LANG => ", lang);
    fetch(`/locals/home-locals/${lang}-texts.json`)
      .then((response) => response.json())
      .then((data) => {
        setTexts(data);
        console.log(data);
      })
      .catch((error) => console.log("Loading texts file error: ", error));
  }, []);

  const [showHomePopup, setShowHomePopup] = useState(true);

  return (
    <div className="homeMain">
      <div className={showHomePopup ? "homePopup" : "hiddenHomePopup"}>
        {showHomePopup ? (
          <>
            <div className="homePopupTextHolder">
              {texts ? texts.home_short_description : <div>Loading...</div>}
            </div>
            <div className="homePopupBtnsHolder">
              <button type="button" className="homePopupBtn">
                Learn More
              </button>
              <button
                type="button"
                className="homePopupBtn"
                onClick={() => setShowHomePopup(false)}
              >
                Hide Description
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="showPopupBtn"
            onClick={() => setShowHomePopup(true)}
          >
            Learn More
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeMain;
