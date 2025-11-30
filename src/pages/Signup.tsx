import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, User, UserPlus, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";

// Free Fire regions
const FREE_FIRE_REGIONS = [
  {'label': 'India', 'value': 'ind'},
  {'label': 'Brazil', 'value': 'br'},
  {'label': 'Indonesia', 'value': 'id'},
  {'label': 'Thailand', 'value': 'th'},
  {'label': 'Vietnam', 'value': 'vn'},
  {'label': 'Europe', 'value': 'eu'},
  {'label': 'Middle East', 'value': 'me'},
  {'label': 'US', 'value': 'us'},
  {'label': 'Bangladesh', 'value': 'bd'},
  {'label': 'Pakistan', 'value': 'pk'},
];

const Signup = () => {
  const [freeFireId, setFreeFireId] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupWithFreeFire } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freeFireId || !region) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate Free Fire ID (should be numeric)
    if (!/^\d+$/.test(freeFireId.trim())) {
      toast.error("Free Fire ID must be a valid numeric ID");
      return;
    }

    try {
      setLoading(true);
      await signupWithFreeFire(freeFireId.trim(), region);
      toast.success("Account created successfully! Welcome to Free Fire Quiz!");
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account";
      
      if (error.message.includes("already registered")) {
        errorMessage = "This Free Fire ID is already registered. Please log in instead.";
      } else if (error.message.includes("verify")) {
        errorMessage = "Invalid Free Fire ID or region. Please check your credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <UserPlus className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center text-gradient">
              Create Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up with your Free Fire ID to start earning coins and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="freeFireId">Free Fire ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="freeFireId"
                    type="text"
                    placeholder="Enter your Free Fire ID"
                    value={freeFireId}
                    onChange={(e) => setFreeFireId(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your Free Fire player ID (numeric)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={region} onValueChange={setRegion} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select your region" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {FREE_FIRE_REGIONS.map((reg) => (
                      <SelectItem key={reg.value} value={reg.value}>
                        {reg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the region where your Free Fire account is registered
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying and creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;


