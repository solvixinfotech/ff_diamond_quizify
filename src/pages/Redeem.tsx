import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { useCoins } from "@/hooks/useCoins";
import { toast } from "sonner";
import { Gem } from "lucide-react";

const Redeem = () => {
  const { coins, spendCoins } = useCoins();
  const [diamonds, setDiamonds] = useState(0);

  const redeemOptions = [
    { coins: 5000, diamonds: 500 },
    { coins: 10000, diamonds: 1100 },
    { coins: 25000, diamonds: 3000 },
  ];

  const handleRedeem = (coinsRequired: number, diamondsEarned: number) => {
    if (spendCoins(coinsRequired)) {
      setDiamonds(diamonds + diamondsEarned);
      toast.success("Redemption Successful! 💎", {
        description: `You received ${diamondsEarned} diamonds!`,
      });
    } else {
      toast.error("Insufficient Coins", {
        description: `You need ${coinsRequired} coins for this redemption.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Redeem <span className="text-gradient">Diamonds</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Exchange your earned coins for Free Fire diamonds
            </p>
          </div>

          {/* Current Diamonds */}
          <Card className="border-border bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                <Gem className="w-12 h-12 text-secondary animate-glow" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Your Diamonds</p>
                  <p className="text-4xl font-bold text-secondary">{diamonds}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redemption Options */}
          <div className="grid md:grid-cols-3 gap-6">
            {redeemOptions.map((option, index) => (
              <Card 
                key={index}
                className="border-border hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="text-5xl mb-2">💎</div>
                  <CardTitle className="text-2xl text-secondary">
                    {option.diamonds} Diamonds
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {option.coins.toLocaleString()} Coins
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleRedeem(option.coins, option.diamonds)}
                    disabled={coins < option.coins}
                    className="w-full bg-gradient-primary hover:opacity-90 shadow-glow disabled:opacity-50"
                  >
                    {coins >= option.coins ? "Redeem Now" : "Not Enough Coins"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="border-border bg-muted/30">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• Complete quizzes to earn coins (50 coins per quiz)</p>
              <p>• Accumulate coins from multiple quizzes</p>
              <p>• Redeem coins for Free Fire diamonds</p>
              <p>• Better rates for larger redemptions!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Redeem;
