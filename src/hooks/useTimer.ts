import { useState } from 'react';

type TimerReturn = [number, React.Dispatch<React.SetStateAction<number>>, (after: () => void) => void, () => void];

let timer: NodeJS.Timer;
export const useTimer = (start: number): TimerReturn => {
  const [ms, setMs] = useState(start);

  const on = (after: () => void) => {
    const _updateMs = (prev: number) => {
      const state = prev - 1000;

      if (state === 0) {
        clearInterval(timer);
        after();
      }

      return state;
    };

    timer = setInterval(() => {
      setMs(_updateMs);
    }, 1000);
  };

  const off = () => {
    clearInterval(timer);
  };

  return [ms, setMs, on, off];
};
