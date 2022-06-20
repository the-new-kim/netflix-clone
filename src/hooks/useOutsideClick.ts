import { useEffect, useRef } from "react";

const useOutsideClick = <T extends HTMLElement>(
  initialState: boolean,
  toggler: Function
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleClick = (event: MouseEvent) => {
      if (initialState && !element.contains(event.target as Node)) toggler();
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [initialState, toggler]);

  return ref;
};

export default useOutsideClick;
