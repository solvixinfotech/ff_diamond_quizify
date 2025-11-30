import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { 
  Info, 
  Trophy, 
  Coins, 
  Users, 
  BookOpen, 
  Gift,
  Shield,
  Zap,
  Target,
  HelpCircle,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const About = () => {
  const { currentUser } = useAuth();
  const features = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge about Free Fire characters, pets, and weapons",
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Earn Coins",
      description: "Complete quizzes to earn coins and redeem them for rewards",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Leaderboards",
      description: "Compete with other players and see who's on top",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Detailed Information",
      description: "Learn about characters, pets, and weapons with detailed descriptions",
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Rewards System",
      description: "Redeem your earned coins for Free Fire diamonds",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Track Progress",
      description: "View your quiz history and achievements",
    },
  ];

  const faqs = [
    {
      question: "How do I earn coins?",
      answer: "You earn 50 coins for each quiz you complete with at least 3 correct answers out of 5 questions.",
    },
    {
      question: "Can I retake a quiz?",
      answer: "No, each quiz can only be completed once. This ensures fair competition and encourages you to study the material first.",
    },
    {
      question: "How do I redeem coins for diamonds?",
      answer: "Visit the Redeem page and choose from available redemption options. Better rates are available for larger redemptions!",
    },
    {
      question: "Do I need to log in?",
      answer: "Yes, you need to log in with your Free Fire ID and region to take quizzes, earn coins, and track your progress.",
    },
    {
      question: "How is the leaderboard calculated?",
      answer: "The leaderboard ranks players by total coins earned and quizzes completed. Rankings update in real-time.",
    },
    {
      question: "What are achievements?",
      answer: "Achievements are milestones you unlock by completing quizzes and earning coins. Track your progress and unlock new achievements!",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <Info className="w-10 h-10 inline-block mr-3 text-primary" />
              About FF Diamond Quizify
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your Free Fire knowledge, earn rewards, and compete with players worldwide!
            </p>
          </div>

          {/* What We Offer */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                What We Offer
              </CardTitle>
              <CardDescription>
                Everything you need to test your Free Fire knowledge and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
                  >
                    <div className="text-primary mb-2">{feature.icon}</div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-border bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sign Up / Log In</h3>
                    <p className="text-sm text-muted-foreground">
                      Create an account using your Free Fire ID and region, or log in if you already have an account.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Take Quizzes</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse available quizzes about characters, pets, and weapons. Complete quizzes to test your knowledge.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Earn Coins</h3>
                    <p className="text-sm text-muted-foreground">
                      Get 50 coins for each quiz you complete with at least 3 correct answers. Accumulate coins from multiple quizzes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Redeem Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit the Redeem page to exchange your coins for Free Fire diamonds. Better rates for larger redemptions!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-0">
                    <h3 className="font-semibold mb-2 flex items-start gap-2">
                      <MessageCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground ml-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle>Ready to Get Started?</CardTitle>
              <CardDescription>
                Explore our features and start earning rewards today!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link to="/">
                  <Button variant="outline">Browse Quizzes</Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="outline">View Leaderboard</Button>
                </Link>
                <Link to="/redeem">
                  <Button variant="outline">Redeem Coins</Button>
                </Link>
                {!currentUser && (
                  <Link to="/signup">
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Sign Up Now
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              FF Diamond Quizify - Test Your Knowledge, Earn Rewards
            </p>
            <p>
              Made with ❤️ for Free Fire players
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

