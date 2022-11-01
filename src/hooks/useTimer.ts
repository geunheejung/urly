import moment from 'moment';
import { useState } from 'react';

type TimerReturn = [number, React.Dispatch<React.SetStateAction<number>>, () => void, () => void];

let timer: NodeJS.Timer;

const useTimer = (start: number): TimerReturn => {
  const [ms, setMs] = useState(start);

  const on = () => {
    const _updateMs = (prev: number) => {
      const _ms = prev - 1000;

      if (_ms === 0) clearInterval(timer);

      return _ms;
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

export const formatter = (ms: number, format = 'mm:ss') => moment(ms).format(format);

export default useTimer;
