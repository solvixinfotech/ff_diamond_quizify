import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { quizzes } from "@/data/quizzes";
import { useCoins } from "@/hooks/useCoins";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCoins } = useCoins();
  const { currentUser, loading: authLoading, isQuizCompleted, completeQuiz, userData } = useAuth();
  const quiz = quizzes.find((q) => q.id === id);
  
  // Get previous quiz result if completed
  const previousResult = userData?.completedQuizzes?.find((q) => q.quizId === id);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(previousResult?.score || 0);
  const [showResult, setShowResult] = useState(!!previousResult);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!quiz) {
      navigate("/");
      return;
    }

    // Check if user is logged in
    if (!authLoading && !currentUser) {
      toast.error("Please log in to take quizzes");
      navigate("/login");
      return;
    }

    // Check if quiz is already completed - redirect if trying to retake
    if (!authLoading && currentUser && isQuizCompleted(quiz.id) && !showResult) {
      toast.info("You have already completed this quiz. Viewing results...");
      // Show results for completed quiz
      setShowResult(true);
    }
  }, [quiz, navigate, currentUser, authLoading, isQuizCompleted, showResult]);

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = async () => {
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = selectedAnswer === question.correctAnswer ? score + 1 : score;
      const passed = finalScore >= 3;
      const coinsEarned = passed ? 50 : 0;

      setShowResult(true);
      setCompleting(true);

      try {
        // Save quiz completion to database
        if (currentUser && !isQuizCompleted(quiz.id)) {
          await completeQuiz(quiz.id, finalScore, quiz.questions.length, coinsEarned);
          
          if (passed) {
            await addCoins(coinsEarned);
            toast.success("🎉 Quiz Completed! +50 Coins", {
              description: "Great job! Keep learning and earning.",
            });
          } else {
            toast.error("Quiz Failed", {
              description: "You need at least 3 correct answers to earn coins.",
            });
          }
        } else if (!currentUser) {
          toast.error("Please log in to save your progress");
        }
      } catch (error: any) {
        console.error("Error completing quiz:", error);
        if (error.message.includes("already completed")) {
          toast.info("You have already completed this quiz");
        } else {
          toast.error("Failed to save quiz completion");
        }
      } finally {
        setCompleting(false);
      }
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login required message
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-2xl mx-auto border-border bg-card">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gradient">
                Login Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-6xl mb-4">
                <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl text-muted-foreground mb-4">
                  You need to log in to take quizzes and earn coins!
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/login")}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResult) {
    const finalScore = previousResult?.score ?? score;
    const passed = finalScore >= 3;
    const isCompleted = isQuizCompleted(quiz.id);
    const isPreviousResult = !!previousResult && !completing;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-2xl mx-auto border-border bg-card">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gradient">
                {isPreviousResult ? "Quiz Results" : "Quiz Completed!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              {completing && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving your progress...</span>
                </div>
              )}
              {isPreviousResult && (
                <Badge variant="secondary" className="mx-auto">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Previously Completed
                </Badge>
              )}
              <div className="text-6xl mb-4">
                {passed ? "🎉" : "😔"}
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{finalScore}/{quiz.questions.length}</p>
                <p className="text-xl text-muted-foreground">
                  {passed ? "Congratulations! You earned 50 coins!" : "You need at least 3 correct answers to earn coins."}
                </p>
                {isCompleted && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ✓ This quiz has been completed and saved to your profile
                  </p>
                )}
                {previousResult && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Completed on {new Date(previousResult.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                >
                  Back to Home
                </Button>
                {!isCompleted && !isPreviousResult && (
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-gradient-primary hover:opacity-90"
                    disabled={completing}
                  >
                    Retry Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="max-w-3xl mx-auto border-border bg-card">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <CardTitle className="text-2xl">{question.question}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto py-4 px-6 ${
                    selectedAnswer === index 
                      ? "bg-gradient-primary shadow-glow" 
                      : "hover:border-primary"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
