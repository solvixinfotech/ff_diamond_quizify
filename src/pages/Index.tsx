import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { quizzes } from "@/data/quizzes";
import heroImage from "@/assets/hero-character.jpg";
import djCharacter from "@/assets/dj-character.jpg";
import sniperCharacter from "@/assets/sniper-character.jpg";
import assaultCharacter from "@/assets/assault-character.jpg";

const Index = () => {
  const characterImages = [djCharacter, sniperCharacter, assaultCharacter];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />
      
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Free Fire Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient animate-slide-up">
              Free Fire Quiz Master
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Test Your Knowledge, Earn Rewards!
            </p>
          </div>
        </div>
      </section>

      {/* Quizzes Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Available <span className="text-gradient">Quizzes</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <Card 
              key={quiz.id} 
              className="group hover:shadow-glow transition-all duration-300 hover:scale-105 border-border bg-card overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={characterImages[index]} 
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-2xl">🪙</span>
                    <span className="font-bold">50 Coins</span>
                  </div>
                  <Link to={`/quiz/${quiz.id}`}>
                    <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                      Start Quiz
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
