import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trophy, Coins, Award, Medal, Crown, Star } from "lucide-react";
import { Loader2 } from "lucide-react";

interface LeaderboardUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  totalCoins: number;
  quizzesCompleted: number;
  freeFireId?: string;
}

const Leaderboard = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topByCoins, setTopByCoins] = useState<LeaderboardUser[]>([]);
  const [topByQuizzes, setTopByQuizzes] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState("coins");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");

        // Fetch top users by coins
        const coinsQuery = query(
          usersRef,
          orderBy("totalCoins", "desc"),
          limit(50)
        );
        const coinsSnapshot = await getDocs(coinsQuery);
        const coinsData = coinsSnapshot.docs
          .map((doc) => doc.data() as LeaderboardUser)
          .filter((user) => user.totalCoins > 0);

        // Fetch top users by quizzes completed
        const quizzesQuery = query(
          usersRef,
          orderBy("quizzesCompleted", "desc"),
          limit(50)
        );
        const quizzesSnapshot = await getDocs(quizzesQuery);
        const quizzesData = quizzesSnapshot.docs
          .map((doc) => doc.data() as LeaderboardUser)
          .filter((user) => user.quizzesCompleted > 0);

        setTopByCoins(coinsData);
        setTopByQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50";
    return "";
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentList = activeTab === "coins" ? topByCoins : topByQuizzes;
  const currentUserRank = currentUser
    ? currentList.findIndex((user) => user.uid === currentUser.uid) + 1
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <Trophy className="w-10 h-10 inline-block mr-3 text-primary" />
              Leaderboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Compete with other players and climb to the top!
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="coins" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Top Coins
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Top Quizzes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coins" className="space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-primary" />
                    Top Players by Coins
                  </CardTitle>
                  <CardDescription>
                    Players ranked by total coins earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topByCoins.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No players yet. Be the first to complete a quiz!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topByCoins.map((user, index) => {
                        const rank = index + 1;
                        const isCurrentUser = currentUser?.uid === user.uid;
                        return (
                          <div
                            key={user.uid}
                            className={`flex items-center gap-4 p-4 rounded-lg border ${
                              isCurrentUser
                                ? "bg-primary/10 border-primary"
                                : getRankColor(rank)
                            }`}
                          >
                            <div className="flex items-center justify-center w-12 h-12">
                              {getRankIcon(rank)}
                            </div>
                            <Avatar className="w-12 h-12 border-2 border-primary">
                              <AvatarImage src={user.photoURL || undefined} />
                              <AvatarFallback>
                                {getInitials(user.displayName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">
                                  {user.displayName || `Player ${user.freeFireId || user.uid.slice(0, 8)}`}
                                </p>
                                {isCurrentUser && (
                                  <Badge variant="secondary" className="text-xs">
                                    You
                                  </Badge>
                                )}
                              </div>
                              {user.freeFireId && (
                                <p className="text-xs text-muted-foreground">
                                  FF ID: {user.freeFireId}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-primary font-bold text-lg">
                                <Coins className="w-5 h-5" />
                                {user.totalCoins.toLocaleString()}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {user.quizzesCompleted || 0} quizzes
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Top Players by Quizzes
                  </CardTitle>
                  <CardDescription>
                    Players ranked by quizzes completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topByQuizzes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No players yet. Be the first to complete a quiz!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topByQuizzes.map((user, index) => {
                        const rank = index + 1;
                        const isCurrentUser = currentUser?.uid === user.uid;
                        return (
                          <div
                            key={user.uid}
                            className={`flex items-center gap-4 p-4 rounded-lg border ${
                              isCurrentUser
                                ? "bg-primary/10 border-primary"
                                : getRankColor(rank)
                            }`}
                          >
                            <div className="flex items-center justify-center w-12 h-12">
                              {getRankIcon(rank)}
                            </div>
                            <Avatar className="w-12 h-12 border-2 border-primary">
                              <AvatarImage src={user.photoURL || undefined} />
                              <AvatarFallback>
                                {getInitials(user.displayName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">
                                  {user.displayName || `Player ${user.freeFireId || user.uid.slice(0, 8)}`}
                                </p>
                                {isCurrentUser && (
                                  <Badge variant="secondary" className="text-xs">
                                    You
                                  </Badge>
                                )}
                              </div>
                              {user.freeFireId && (
                                <p className="text-xs text-muted-foreground">
                                  FF ID: {user.freeFireId}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-primary font-bold text-lg">
                                <Trophy className="w-5 h-5" />
                                {user.quizzesCompleted || 0}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {user.totalCoins?.toLocaleString() || 0} coins
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {currentUser && currentUserRank > 0 && currentUserRank <= 10 && (
            <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">You're in the top 10! 🎉</p>
                <p className="text-sm text-muted-foreground">
                  Keep it up to maintain your position!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

