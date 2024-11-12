import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return [darkMode, setDarkMode];
}
