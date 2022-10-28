import { useState } from 'react';

export const useTimer = (start: number): [number, React.Dispatch<React.SetStateAction<number>>, () => void] => {
  const [ms, setMs] = useState(start);
  let timerId: NodeJS.Timer;

  const on = () => {
    timerId = setInterval(() => {
      setMs((prev) => prev - 1000);

      if (ms === 0) clearInterval(timerId);
    }, 1000);
  };

  return [ms, setMs, on];
};
