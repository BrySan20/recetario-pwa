// Hook para vibración
export function useVibration() {
  const vibrate = (pattern: number | number[] = 200) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return { vibrate };
}