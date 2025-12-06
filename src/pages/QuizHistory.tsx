import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { quizzes } from "@/data/quizzes";
import { History, Trophy, Coins, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const QuizHistory = () => {
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading your quiz history...</p>
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
                Please log in to view your quiz history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completedQuizzes = userData?.completedQuizzes || [];

  // Get quiz details for each completed quiz
  const quizHistory = completedQuizzes
    .map((completed) => {
      const quiz = quizzes.find((q) => q.id === completed.quizId);
      return {
        ...completed,
        quiz,
      };
    })
    .filter((item) => item.quiz) // Filter out quizzes that no longer exist
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return { label: "Perfect!", variant: "default" as const };
    if (percentage >= 80) return { label: "Excellent", variant: "default" as const };
    if (percentage >= 60) return { label: "Good", variant: "secondary" as const };
    return { label: "Try Again", variant: "outline" as const };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <History className="w-10 h-10 inline-block mr-3 text-primary" />
              Quiz History
            </h1>
            <p className="text-xl text-muted-foreground">
              View all your completed quizzes and track your progress
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Quizzes</p>
                    <p className="text-3xl font-bold text-primary">
                      {completedQuizzes.length}
                    </p>
                  </div>
                  <Trophy className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Coins Earned</p>
                    <p className="text-3xl font-bold text-primary">
                      {completedQuizzes.reduce((sum, q) => sum + (q.coinsEarned || 0), 0)}
                    </p>
                  </div>
                  <Coins className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold text-primary">
                      {quizHistory.length > 0
                        ? Math.round(
                            (quizHistory.reduce(
                              (sum, q) => sum + (q.score / q.totalQuestions) * 100,
                              0
                            ) /
                              quizHistory.length) *
                              10
                          ) / 10
                        : 0}
                      %
                    </p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz History List */}
          {quizHistory.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center py-12">
                <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Quiz History</h3>
                <p className="text-muted-foreground mb-6">
                  Start taking quizzes to build your history!
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Browse Quizzes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((item, index) => {
                const scoreBadge = getScoreBadge(item.score, item.totalQuestions);
                const percentage = Math.round((item.score / item.totalQuestions) * 100);

                return (
                  <Card
                    key={`${item.quizId}-${index}`}
                    className="border-border hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">
                              {item.quiz?.title || "Unknown Quiz"}
                            </h3>
                            <Badge variant={scoreBadge.variant}>
                              {scoreBadge.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(item.completedAt), "MMM dd, yyyy 'at' h:mm a")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {item.score}/{item.totalQuestions} correct
                            </div>
                            {item.coinsEarned > 0 && (
                              <div className="flex items-center gap-1 text-primary">
                                <Coins className="w-4 h-4" />
                                +{item.coinsEarned} coins
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div
                            className={`text-3xl font-bold ${getScoreColor(
                              item.score,
                              item.totalQuestions
                            )}`}
                          >
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;

