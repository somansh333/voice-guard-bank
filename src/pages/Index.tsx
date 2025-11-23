import { Link } from "react-router-dom";
import { Shield, Mic, Brain, Users, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SentinelPay
            </span>
          </div>
          <Link to="/auth">
            <Button variant="outline" size="lg" className="rounded-full">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Banking That{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Listens
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Voice-first AI banking assistant designed for everyone. Secure, inclusive, and fraud-protected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/assistant">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg">
                <Mic className="mr-2 h-5 w-5" />
                Start Voice Banking
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Trusted Banking Protection
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Anti-Deepfake Detection</CardTitle>
              <CardDescription>
                Voice liveness verification protects against AI-generated voice fraud
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-warning" />
              </div>
              <CardTitle>Stress Detection</CardTitle>
              <CardDescription>
                AI monitors voice patterns to detect signs of coercion or stress during transactions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-danger" />
              </div>
              <CardTitle>Scam Prevention</CardTitle>
              <CardDescription>
                Real-time detection of common scam phrases and suspicious requests
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Guardian Mode</CardTitle>
              <CardDescription>
                High-risk transactions automatically notify trusted guardians for elderly users
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Accent-Adaptive Voice</CardTitle>
              <CardDescription>
                Understands Hinglish and Indian-English speech patterns perfectly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Explainable AI</CardTitle>
              <CardDescription>
                Clear, human-friendly explanations for every security decision
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-secondary text-white border-0">
          <CardContent className="p-12 text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Ready to Experience Secure Voice Banking?
            </h3>
            <p className="text-lg text-white/90">
              Join thousands of users who trust SentinelPay for safe, accessible banking
            </p>
            <Link to="/assistant">
              <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 SentinelPay. Secure voice-first banking for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
