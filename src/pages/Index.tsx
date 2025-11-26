import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { quizzes } from "@/data/quizzes";
import type { Quiz } from "@/data/quizzes";
import heroImage from "@/assets/hero-character.jpg";

const CATEGORY_TABS = [
  { id: "characters", label: "Characters" },
  { id: "pets", label: "Pets" },
  { id: "weapons", label: "Weapons" },
] as const;

type CategoryId = (typeof CATEGORY_TABS)[number]["id"];

const categorizedQuizzes: Record<CategoryId, Quiz[]> = CATEGORY_TABS.reduce(
  (acc, category) => {
    acc[category.id] = quizzes.filter((quiz) => quiz.category === category.id);
    return acc;
  },
  {} as Record<CategoryId, Quiz[]>
);

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("characters");

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
              FF Diamond Quizify
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

        <Tabs
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value as CategoryId)}
          className="space-y-8"
        >
          <TabsList className="grid grid-cols-3 gap-2 bg-muted/20 p-1 rounded-xl">
            {CATEGORY_TABS.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg py-2 font-semibold"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORY_TABS.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorizedQuizzes[category.id]?.map((quiz) => {
                  // Extract the name from the quiz ID (format: category-name)
                  const itemName = quiz.id.replace(`${category.id}-`, '');
                  
                  return (
                    <Card
                      key={quiz.id}
                      className="group hover:shadow-glow transition-all duration-300 hover:scale-105 border-border bg-card overflow-hidden"
                    >
                      <Link to={`/details/${category.id}/${itemName}`} state={{ image: quiz.image }}>
                        <div className="relative h-48 overflow-hidden cursor-pointer">
                          <img
                            src={quiz.image}
                            alt={quiz.title}
                            className="cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                          <div className="absolute top-3 right-3">
                            <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                              View Details →
                            </div>
                          </div>
                        </div>
                      </Link>
                      <CardHeader>
                        <div className="flex items-center justify-between text-sm uppercase tracking-wide text-primary">
                          <span>{category.label}</span>
                          <span>{quiz.questions.length} Questions</span>
                        </div>
                        <Link to={`/details/${category.id}/${itemName}`} state={{ image: quiz.image }}>
                          <CardTitle className="text-2xl hover:text-primary transition-colors cursor-pointer">
                            {quiz.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="text-muted-foreground line-clamp-2">
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-primary">
                            <span className="text-2xl">🪙</span>
                            <span className="font-bold">50 Coins</span>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/details/${category.id}/${itemName}`} state={{ image: quiz.image }}>
                              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                                Details
                              </Button>
                            </Link>
                            <Link to={`/quiz/${quiz.id}`}>
                              <Button size="sm" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                                Quiz
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

export default Index;
