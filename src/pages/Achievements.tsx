import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Trophy, 
  Coins, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Crown,
  CheckCircle2,
  Circle
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  current: number;
  unlocked: boolean;
  reward?: number;
}

const Achievements = () => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-2xl mx-auto border-border">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>
                Please log in to view your achievements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const totalCoins = userData?.totalCoins || 0;
  const quizzesCompleted = userData?.quizzesCompleted || 0;
  const completedQuizzes = userData?.completedQuizzes || [];

  // Calculate achievements
  const achievements: Achievement[] = [
    {
      id: "first-quiz",
      title: "First Steps",
      description: "Complete your first quiz",
      icon: <Trophy className="w-6 h-6" />,
      requirement: 1,
      current: quizzesCompleted,
      unlocked: quizzesCompleted >= 1,
    },
    {
      id: "quiz-master-5",
      title: "Quiz Enthusiast",
      description: "Complete 5 quizzes",
      icon: <Star className="w-6 h-6" />,
      requirement: 5,
      current: quizzesCompleted,
      unlocked: quizzesCompleted >= 5,
    },
    {
      id: "quiz-master-10",
      title: "Quiz Expert",
      description: "Complete 10 quizzes",
      icon: <Award className="w-6 h-6" />,
      requirement: 10,
      current: quizzesCompleted,
      unlocked: quizzesCompleted >= 10,
    },
    {
      id: "quiz-master-25",
      title: "Quiz Master",
      description: "Complete 25 quizzes",
      icon: <Crown className="w-6 h-6" />,
      requirement: 25,
      current: quizzesCompleted,
      unlocked: quizzesCompleted >= 25,
    },
    {
      id: "coin-collector-100",
      title: "Coin Collector",
      description: "Earn 100 coins",
      icon: <Coins className="w-6 h-6" />,
      requirement: 100,
      current: totalCoins,
      unlocked: totalCoins >= 100,
    },
    {
      id: "coin-collector-500",
      title: "Wealthy Player",
      description: "Earn 500 coins",
      icon: <Coins className="w-6 h-6" />,
      requirement: 500,
      current: totalCoins,
      unlocked: totalCoins >= 500,
    },
    {
      id: "coin-collector-1000",
      title: "Coin Millionaire",
      description: "Earn 1,000 coins",
      icon: <Coins className="w-6 h-6" />,
      requirement: 1000,
      current: totalCoins,
      unlocked: totalCoins >= 1000,
    },
    {
      id: "perfect-score",
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: <Target className="w-6 h-6" />,
      requirement: 1,
      current: completedQuizzes.filter(
        (q) => q.score === q.totalQuestions
      ).length,
      unlocked: completedQuizzes.some((q) => q.score === q.totalQuestions),
    },
    {
      id: "streak-3",
      title: "On a Roll",
      description: "Complete 3 quizzes in a row",
      icon: <Zap className="w-6 h-6" />,
      requirement: 3,
      current: 0, // This would need date tracking
      unlocked: false,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;
  const progress = (unlockedCount / totalAchievements) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <Trophy className="w-10 h-10 inline-block mr-3 text-primary" />
              Achievements
            </h1>
            <p className="text-xl text-muted-foreground">
              Unlock achievements and showcase your progress
            </p>
          </div>

          {/* Progress Summary */}
          <Card className="border-border bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Achievement Progress
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {unlockedCount} / {totalAchievements}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Completion
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const progressPercent = Math.min(
                (achievement.current / achievement.requirement) * 100,
                100
              );

              return (
                <Card
                  key={achievement.id}
                  className={`border-border transition-all duration-300 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/50 shadow-glow"
                      : "opacity-75"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className={`p-3 rounded-lg ${
                          achievement.unlocked
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      {achievement.unlocked ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {achievement.current} / {achievement.requirement}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="default" className="w-full justify-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        Unlocked!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tips */}
          <Card className="border-border bg-muted/30">
            <CardHeader>
              <CardTitle>Tips to Unlock More Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• Complete quizzes regularly to increase your quiz count</p>
              <p>• Aim for perfect scores to unlock the Perfect Score achievement</p>
              <p>• Accumulate coins by completing more quizzes</p>
              <p>• Check back regularly as new achievements are added!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;

