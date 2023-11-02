import React from "react";
import "./loader.css";
const PreLoader = () => {
  return (
    <div>
      <div className="preloader-wrap">
        <div className="preloader">
          <div className="loading-circle loading-circle-two"></div>
          <div className="loading-circle loading-circle-three"></div>
          <div className="loading-circle loading-circle-one"></div>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
