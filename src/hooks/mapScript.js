import { useState, useEffect } from "react";

const useScript = (src, id) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector(`#${id}`)) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.async = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => console.error(`Failed to load script: ${src}`);

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [src, id]);

  return loaded;
};

export default useScript;
