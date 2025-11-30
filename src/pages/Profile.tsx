import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import CoinDisplay from "@/components/CoinDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Mail, Calendar, Trophy, Coins, LogOut, Edit } from "lucide-react";

const Profile = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !userData) {
    return null;
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CoinDisplay />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              My <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your account and view your progress
            </p>
          </div>

          {/* Profile Header Card */}
          <Card className="border-border bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-glow">
                  <AvatarImage src={userData.photoURL || undefined} alt={userData.displayName || "User"} />
                  <AvatarFallback className="text-3xl bg-gradient-primary">
                    {getInitials(userData.displayName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{userData.displayName || "Anonymous User"}</h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      {userData.email && (
                        <Badge variant="outline" className="text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {userData.email}
                        </Badge>
                      )}
                      {userData.freeFireId && (
                        <Badge variant="outline" className="text-sm">
                          <User className="w-3 h-3 mr-1" />
                          FF ID: {userData.freeFireId}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined {formatDate(userData.createdAt)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-500 hover:text-red-600"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quiz Stats */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Quiz Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                    <p className="text-3xl font-bold text-primary">{userData.quizzesCompleted || 0}</p>
                  </div>
                  <Trophy className="w-12 h-12 text-primary opacity-20" />
                </div>

                <Separator />

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Coins Earned</p>
                    <p className="text-3xl font-bold text-primary">{userData.totalCoins || 0}</p>
                  </div>
                  <Coins className="w-12 h-12 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">User ID</span>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {userData.uid.slice(0, 8)}...
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Display Name</span>
                    <span className="font-semibold">{userData.displayName || "Not set"}</span>
                  </div>

                  <Separator />

                  {userData.email && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="font-semibold text-sm">{userData.email}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {userData.freeFireId && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Free Fire ID</span>
                        <span className="font-semibold text-sm">{userData.freeFireId}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {userData.region && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Region</span>
                        <span className="font-semibold text-sm">{userData.region.toUpperCase()}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-semibold text-sm">{formatDate(userData.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your quiz progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.quizzesCompleted && userData.quizzesCompleted > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Quiz Master</h4>
                      <p className="text-sm text-muted-foreground">
                        Completed {userData.quizzesCompleted} quizzes
                      </p>
                    </div>
                    <Badge className="bg-gradient-primary">Active</Badge>
                  </div>

                  {userData.totalCoins && userData.totalCoins >= 100 && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Coins className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Coin Collector</h4>
                        <p className="text-sm text-muted-foreground">
                          Earned {userData.totalCoins} total coins
                        </p>
                      </div>
                      <Badge className="bg-gradient-primary">Achieved</Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start taking quizzes to earn coins and unlock achievements!
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-primary hover:opacity-90 shadow-glow"
                  >
                    Browse Quizzes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
