import { useState } from "react";
import "./HomeStyle.css";

const HomeMain = () => {
  const [showHomePopup, setShowHomePopup] = useState(true);

  return (
    <div className="homeMain">
      <div className={showHomePopup ? "homePopup" : "hiddenHomePopup"}>
        {showHomePopup ? (
          <>
            <div className="homePopupTextHolder">
              HOME.NECTOR webiste is control panel for private IoT used in your
              home. This website allows you to control deviced from your
              network. You can collect data from sensors, display it and store
              to database. You can also access multiple home cameras and watch
              your home even if you are thousands meters away. Robots also can
              be controled from this website. Enjoy and feel the future at home.
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
