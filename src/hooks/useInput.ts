import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type UseInputReturn<T> = [T, Dispatch<SetStateAction<T>>, (value: T) => void];
export const useInput = <T>(initialValue: T): UseInputReturn<T> => {
  const [value, setValue] = useState(initialValue);
  const handleChange = useCallback((value: T) => setValue(value), [value]);
  return [value, setValue, handleChange];
};
