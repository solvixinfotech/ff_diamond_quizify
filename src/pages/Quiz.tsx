import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { quizzes } from "@/data/quizzes";
import { useCoins } from "@/hooks/useCoins";
import { toast } from "sonner";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCoins } = useCoins();
  const quiz = quizzes.find((q) => q.id === id);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!quiz) {
      navigate("/");
    }
  }, [quiz, navigate]);

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      const finalScore = selectedAnswer === question.correctAnswer ? score + 1 : score;
      if (finalScore >= 3) {
        addCoins(50);
        toast.success("🎉 Quiz Completed! +50 Coins", {
          description: "Great job! Keep learning and earning.",
        });
      } else {
        toast.error("Quiz Failed", {
          description: "You need at least 3 correct answers to earn coins.",
        });
      }
    }
  };

  if (showResult) {
    const finalScore = score;
    const passed = finalScore >= 3;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-2xl mx-auto border-border bg-card">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gradient">
                Quiz Completed!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-6xl mb-4">
                {passed ? "🎉" : "😔"}
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{finalScore}/5</p>
                <p className="text-xl text-muted-foreground">
                  {passed ? "Congratulations! You earned 50 coins!" : "You need at least 3 correct answers to earn coins."}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                >
                  Back to Home
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Retry Quiz
                </Button>
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
