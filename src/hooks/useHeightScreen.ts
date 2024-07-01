import { useEffect, useState } from "react";

const useHeightScreen = () => {
    
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    const updateMinHeight = () => {
      const screenHeight = window.innerHeight;
      setMinHeight(screenHeight);
    };
    window.addEventListener("resize", updateMinHeight);
    updateMinHeight();

    return () => {
      window.removeEventListener("resize", updateMinHeight);
    };
  }, []);

  return minHeight;
};

export default useHeightScreen;
