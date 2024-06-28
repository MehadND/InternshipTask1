export function debounce(func: () => void, delay: number) {
  let timeout = null;
  return () => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func();
    }, delay);
  };
}
