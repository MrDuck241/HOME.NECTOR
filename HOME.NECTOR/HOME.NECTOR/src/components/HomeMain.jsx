import { useState } from "react";

import "../styles/HomeMainStyle.css";

const HomeMain = () => {
  const [showPopupText, setShowPopupText] = useState(true);

  return (
    <div className="main">
      <div
        className={`homePagePopup 
                ${
                  showPopupText
                    ? "h-[50%]"
                    : "h-[20%] pt-[30px] overflow-y-hidden justify-evenly"
                }`}
      >
        {showPopupText && (
          <div className="homePagePopupTextHolder">
            HOME.NECTOR webiste is control panel for private IoT used in your
            home. This website allows you to control deviced from your network.
            You can collect data from sensors, display it and store to database.
            You can also access multiple home cameras and watch your home even
            if you are thousands meters away. Robots also can be controled from
            this website. Enjoy and feel the future at home.
          </div>
        )}
        <div className="homePagePopupBtnHolder">
          <button
            type="button"
            className="homePagePopupBtn"
            onClick={() => setShowPopupText(true)}
          >
            Learn More
          </button>
          <button
            type="button"
            className="homePagePopupBtn"
            onClick={() => setShowPopupText(false)}
          >
            Hide Description
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeMain;
