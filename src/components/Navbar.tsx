import { Link, useLocation } from "react-router-dom";
import { Home, User, Trophy, LogIn, LogOut, Award, History, Info, BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { currentUser, userData, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-xl font-bold">FF</span>
            </div>
            <span className="text-xl font-bold text-gradient">Diamond Quizify</span>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 transition-colors ${
                isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden lg:inline">Home</span>
            </Link>
            {currentUser && (
              <>
                <Link 
                  to="/leaderboard" 
                  className={`flex items-center gap-2 transition-colors ${
                    isActive("/leaderboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="hidden lg:inline">Leaderboard</span>
                </Link>
                <Link 
                  to="/history" 
                  className={`flex items-center gap-2 transition-colors ${
                    isActive("/history") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span className="hidden lg:inline">History</span>
                </Link>
                <Link 
                  to="/achievements" 
                  className={`flex items-center gap-2 transition-colors ${
                    isActive("/achievements") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Award className="w-5 h-5" />
                  <span className="hidden lg:inline">Achievements</span>
                </Link>
              </>
            )}
            <Link 
              to="/redeem" 
              className={`flex items-center gap-2 transition-colors ${
                isActive("/redeem") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="hidden lg:inline">Redeem</span>
            </Link>
            <Link 
              to="/about" 
              className={`flex items-center gap-2 transition-colors ${
                isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="hidden lg:inline">About</span>
            </Link>
            {/* User Menu or Login Button */}
            {currentUser && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={userData.photoURL || undefined} alt={userData.displayName || "User"} />
                      <AvatarFallback className="bg-gradient-primary text-sm">
                        {getInitials(userData.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData.displayName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>Quiz History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/achievements" className="cursor-pointer">
                      <Award className="mr-2 h-4 w-4" />
                      <span>Achievements</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/leaderboard" className="cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Leaderboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/redeem" className="cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Redeem Rewards</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-2 transition-colors ${
                    isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <Link to="/login">
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Login</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
