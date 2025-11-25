import { Link, useLocation } from "react-router-dom";
import { Home, User, Trophy } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-xl font-bold">FF</span>
            </div>
            <span className="text-xl font-bold text-gradient">Quiz Master</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 transition-colors ${
                isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link 
              to="/redeem" 
              className={`flex items-center gap-2 transition-colors ${
                isActive("/redeem") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="hidden sm:inline">Redeem</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center gap-2 transition-colors ${
                isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
