import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface PlayerData {
  uid: string;
  name: string;
  level: number;
  winRate: string;
  csRank: string;
  brRank: string;
  totalMatches: {
    br: number;
    cs: number;
  };
  guild: {
    name: string;
    level: number;
  };
}

// Mock player data for demonstration
const mockPlayers: { [key: string]: PlayerData } = {
  "123456789": {
    uid: "123456789",
    name: "ProGamer2024",
    level: 75,
    winRate: "68%",
    csRank: "Heroic",
    brRank: "Diamond II",
    totalMatches: {
      br: 1250,
      cs: 890,
    },
    guild: {
      name: "Elite Warriors",
      level: 12,
    },
  },
  "987654321": {
    uid: "987654321",
    name: "SnipeMaster",
    level: 82,
    winRate: "72%",
    csRank: "Grand Master",
    brRank: "Heroic I",
    totalMatches: {
      br: 2100,
      cs: 1540,
    },
    guild: {
      name: "Shadow Legion",
      level: 15,
    },
  },
};

const Profile = () => {
  const [uid, setUid] = useState("");
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!uid.trim()) {
      toast.error("Please enter a UID");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const data = mockPlayers[uid];
      
      if (data) {
        setPlayerData(data);
        toast.success("Player Found!");
      } else {
        setPlayerData(null);
        toast.error("Player not found", {
          description: "Try UIDs: 123456789 or 987654321 for demo",
        });
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Player <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Search for any Free Fire player by their UID
            </p>
          </div>

          {/* Search Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Enter Player UID</CardTitle>
              <CardDescription>
                Enter the player's UID to view their stats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="uid" className="sr-only">UID</Label>
                  <Input
                    id="uid"
                    placeholder="Enter UID (e.g., 123456789)"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-gradient-primary hover:opacity-90 shadow-glow"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Player Stats */}
          {playerData && (
            <div className="space-y-6 animate-slide-up">
              {/* Player Info Card */}
              <Card className="border-border bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl">{playerData.name}</CardTitle>
                      <CardDescription className="text-lg">
                        UID: {playerData.uid} • Level {playerData.level}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-3xl font-bold text-primary">{playerData.winRate}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Ranked Stats */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Ranked Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CS Rank</span>
                      <span className="font-bold text-lg text-secondary">{playerData.csRank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">BR Rank</span>
                      <span className="font-bold text-lg text-primary">{playerData.brRank}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Matches */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Total Matches</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Battle Royale</span>
                      <span className="font-bold text-lg">{playerData.totalMatches.br}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Clash Squad</span>
                      <span className="font-bold text-lg">{playerData.totalMatches.cs}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Guild Info */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Guild Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{playerData.guild.name}</p>
                      <p className="text-muted-foreground">Guild Level {playerData.guild.level}</p>
                    </div>
                    <div className="text-5xl">🛡️</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
