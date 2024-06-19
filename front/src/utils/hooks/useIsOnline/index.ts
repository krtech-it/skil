import { useState, useEffect } from "react";

const useIsOnline = (): boolean => {
  const { navigator } = window;
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const worker = new Worker(new URL("./checkOnline.ts", import.meta.url));

    worker.onmessage = (e: MessageEvent<boolean>) => {
      setIsOnline(e.data);
    };

    return () => {
      worker.postMessage("terminate");
      worker.terminate();
    };
  }, []);

  return isOnline;
};

export default useIsOnline;
