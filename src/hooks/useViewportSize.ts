import { useEffect, useState } from "react";

const useViewportSize = () => {
  const [size, setSize] = useState({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setSize({
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        });
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

export default useViewportSize;
