import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const COINS_KEY = "freefire_quiz_coins";

export const useCoins = () => {
  const { userData, updateCoins } = useAuth();
  const [coins, setCoins] = useState<number>(() => {
    // If user is logged in, use database value, otherwise use localStorage
    if (userData?.totalCoins !== undefined) {
      return userData.totalCoins;
    }
    const stored = localStorage.getItem(COINS_KEY);
    return stored ? parseInt(stored) : 0;
  });

  // Sync with userData from database
  useEffect(() => {
    if (userData?.totalCoins !== undefined) {
      setCoins(userData.totalCoins);
    } else {
      // Fallback to localStorage for non-authenticated users
      const stored = localStorage.getItem(COINS_KEY);
      if (stored) {
        setCoins(parseInt(stored));
      }
    }
  }, [userData?.totalCoins]);

  const addCoins = async (amount: number) => {
    const newAmount = coins + amount;
    setCoins(newAmount);
    
    // Update in database if user is logged in
    if (userData) {
      try {
        await updateCoins(amount);
      } catch (error) {
        console.error("Failed to update coins in database:", error);
        // Revert local state on error
        setCoins(coins);
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      localStorage.setItem(COINS_KEY, newAmount.toString());
    }
  };

  const spendCoins = async (amount: number): Promise<boolean> => {
    if (coins >= amount) {
      const newAmount = coins - amount;
      setCoins(newAmount);
      
      // Update in database if user is logged in
      if (userData) {
        try {
          await updateCoins(-amount);
          return true;
        } catch (error) {
          console.error("Failed to update coins in database:", error);
          // Revert local state on error
          setCoins(coins);
          return false;
        }
      } else {
        // Fallback to localStorage for non-authenticated users
        localStorage.setItem(COINS_KEY, newAmount.toString());
        return true;
      }
    }
    return false;
  };

  return { coins, addCoins, spendCoins };
};
