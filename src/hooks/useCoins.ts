import { useState, useEffect } from "react";

const COINS_KEY = "freefire_quiz_coins";

export const useCoins = () => {
  const [coins, setCoins] = useState<number>(() => {
    const stored = localStorage.getItem(COINS_KEY);
    return stored ? parseInt(stored) : 0;
  });

  useEffect(() => {
    localStorage.setItem(COINS_KEY, coins.toString());
  }, [coins]);

  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  const spendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      setCoins((prev) => prev - amount);
      return true;
    }
    return false;
  };

  return { coins, addCoins, spendCoins };
};
