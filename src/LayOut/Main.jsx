import React, { useEffect, useState } from "react";
import FrontPage from "../Pages/FrontPage";
import PreLoader from "../Component/PreLoader/PreLoader";

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  <style>body{isLoading}</style>;
  return (
    <div>
      <div>
        {isLoading ? (
          <PreLoader />
        ) : (
          <div>
            <FrontPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
