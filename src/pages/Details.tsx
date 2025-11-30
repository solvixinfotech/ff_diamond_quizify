import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Trophy, Zap, Shield, Target, Info, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { getItemDetails, type ItemDetails, type QuizCategory } from "@/data/quizzes";
import { quizzes } from "@/data/quizzes";
import { toast } from "sonner";

const Details = () => {
  const { category, name } = useParams<{ category: string; name: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const image = location.state?.image;
  const { currentUser, isQuizCompleted } = useAuth();

  // Find the quiz for this item
  const quizId = category && name 
    ? `${category}-${name.toLowerCase().replace(/\s+/g, '-')}`
    : null;
  const quiz = quizId ? quizzes.find((q) => q.id === quizId) : null;
  const completed = quiz && currentUser ? isQuizCompleted(quiz.id) : false;

  const handleStartQuiz = () => {
    if (!currentUser) {
      toast.error("Please log in to take quizzes");
      navigate("/login");
      return;
    }
    
    if (completed) {
      toast.info("You have already completed this quiz");
      return;
    }
    
    if (quiz) {
      navigate(`/quiz/${quiz.id}`);
    }
  };

  if (!category || !name) {
    navigate("/");
    return null;
  }

  const details = getItemDetails(category as QuizCategory, name);

  if (!details) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CoinDisplay />
        <div className="container mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Details Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const imagePath = image || `/images/${category}/${name}.webp`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-6">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary">
                  <img
                    src={imagePath}
                    alt={details.name}
                    className="absolute top-2/4 -translate-y-1/2 w-full cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-primary border-primary">
                      {category}
                    </Badge>
                    <Badge variant="secondary">
                      {details.release.update}
                    </Badge>
                  </div>
                  <CardTitle className="text-4xl mb-2 text-gradient">
                    {details.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    {details.title}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {details.description}
                </p>
              </div>

              {details.role && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Role</h3>
                  <Badge variant="outline" className="text-base">
                    {details.role}
                  </Badge>
                </div>
              )}

              {details.type && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Type</h3>
                  <Badge variant="outline" className="text-base">
                    {details.type}
                  </Badge>
                </div>
              )}

              <Separator />

              {/* Ability/Skill Section */}
              {(details.ability || details.skill) && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    {details.ability ? details.ability.name : details.skill?.name}
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-primary">
                        {details.ability?.type || details.skill?.type}
                      </Badge>
                    </div>
                    
                    {details.ability?.details?.effects && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Effects</h4>
                        <ul className="space-y-1">
                          {details.ability.details.effects.map((effect: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {details.skill?.details?.special_effects && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Special Effects</h4>
                        <ul className="space-y-1">
                          {details.skill.details.special_effects.map((effect: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Display other ability/skill details */}
                    {details.ability?.details && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {Object.entries(details.ability.details)
                          .filter(([key]) => !['effects', 'special_effects'].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Weapon Stats */}
              {details.weapon_type && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Weapon Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {details.damage !== undefined && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Damage</div>
                        <div className="text-2xl font-bold text-primary">{details.damage}</div>
                      </div>
                    )}
                    {details.fire_rate && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Fire Rate</div>
                        <div className="text-2xl font-bold text-primary">{details.fire_rate}</div>
                      </div>
                    )}
                    {details.range && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Range</div>
                        <div className="text-lg font-bold text-primary">{details.range}</div>
                      </div>
                    )}
                    {details.magazine_size && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Magazine</div>
                        <div className="text-2xl font-bold text-primary">{details.magazine_size}</div>
                      </div>
                    )}
                    {details.reload_time && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Reload</div>
                        <div className="text-2xl font-bold text-primary">{details.reload_time}s</div>
                      </div>
                    )}
                    {details.healing_per_second && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Healing/s</div>
                        <div className="text-2xl font-bold text-primary">{details.healing_per_second}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Features */}
              {details.special_features && details.special_features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Special Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.special_features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side Cards */}
          <div className="space-y-6">
            {/* Strengths */}
            {details.strengths && details.strengths.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-500">
                    <Shield className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {details.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {details.weaknesses && details.weaknesses.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <Info className="w-5 h-5" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {details.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Best For */}
            {details.best_for && details.best_for.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Best For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {details.best_for.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            {details.tips && details.tips.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {details.tips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Start Quiz Button */}
            <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="text-center">Ready to Test?</CardTitle>
                <CardDescription className="text-center">
                  {completed 
                    ? "You've already completed this quiz!" 
                    : currentUser 
                    ? "Take the quiz to earn coins!"
                    : "Log in to take the quiz and earn coins!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {completed && (
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Quiz Completed
                  </Badge>
                )}
                {!currentUser && (
                  <Badge variant="outline" className="w-full justify-center py-2 text-muted-foreground">
                    <Lock className="w-4 h-4 mr-2" />
                    Login Required
                  </Badge>
                )}
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                  onClick={handleStartQuiz}
                  disabled={completed}
                >
                  {completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Already Completed
                    </>
                  ) : !currentUser ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Log In to Start
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Start Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Best Combinations */}
        {details.best_combinations && details.best_combinations.length > 0 && (
          <Card className="border-border bg-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Best Combinations</CardTitle>
              <CardDescription>
                Recommended character/pet combinations for maximum effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.best_combinations.map((combo, index) => (
                  <div key={index} className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {combo.combo.map((item, idx) => (
                        <Badge key={idx} className="bg-gradient-primary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{combo.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Details;

