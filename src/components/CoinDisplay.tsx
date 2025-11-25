import { Coins } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";

const CoinDisplay = () => {
  const { coins } = useCoins();
  
  return (
    <div className="fixed top-20 right-4 z-40 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <Coins className="w-5 h-5 text-primary animate-glow" />
        <span className="font-bold text-lg">{coins}</span>
      </div>
    </div>
  );
};

export default CoinDisplay;
