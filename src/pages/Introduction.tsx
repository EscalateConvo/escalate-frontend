import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Zap, BarChart3, Users, Shield, ArrowRight, TrendingUp, Clock, CheckCircle2, Star } from 'lucide-react';
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

export default function Introduction() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Escalated</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90 shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-background to-slate-50/50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Badge with amber accent */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-600 text-sm font-medium border border-amber-200">
              <Zap className="h-4 w-4" />
              AI-Driven Roleplay Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Stress-Test Customer Service Candidates
              <span className="block text-primary mt-2">Before You Hire Them</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The AI-driven roleplay platform that reveals how candidates handle pressure, 
              frustration, and emotional situations—before they join your team.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/signup">
                <InteractiveHoverButton>
                    Start Testing Candidates
                </InteractiveHoverButton>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Free trial included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-50 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">The Challenge</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
                The Resume Gap in Customer Service
              </h2>
              <p className="text-lg text-muted-foreground">
                Traditional hiring methods fail to reveal how candidates handle real-world stress
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="font-semibold text-foreground mb-2">Resumes Don't Show Empathy</h3>
                <p className="text-sm text-muted-foreground">
                  A perfect CV doesn't reveal how someone handles an angry customer or emotional crisis.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="font-semibold text-foreground mb-2">Interviews Are Staged</h3>
                <p className="text-sm text-muted-foreground">
                  Candidates are on their best behavior with human managers, not showing their real reactions.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💸</div>
                <h3 className="font-semibold text-foreground mb-2">High Training Costs</h3>
                <p className="text-sm text-muted-foreground">
                  Companies spend thousands training agents who quit in month 1 due to emotional toll.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
              Automated "Stress Test" Interviews
            </h2>
            <p className="text-lg text-muted-foreground">
              Configure AI roleplay scenarios that test candidates under realistic pressure
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                  <Users className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Configure Scenarios</h3>
                  <p className="text-muted-foreground">
                    Create roleplay scenarios like "The Lost Refund" or "The Cancelled Flight" 
                    with AI personas that act with realistic emotion.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI-Powered Roleplay</h3>
                  <p className="text-muted-foreground">
                    Candidates connect via voice call with an AI agent that adapts—getting angrier 
                    if the candidate is rude, calming down if they're empathetic.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Quantitative Scoring</h3>
                  <p className="text-muted-foreground">
                    Get a "Composure Score" that measures interrupt rate, sentiment volatility, 
                    and keyword compliance—turning gut feelings into data.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Score Preview Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-100/50 rounded-3xl transform rotate-3" />
              <div className="relative bg-background rounded-2xl shadow-xl border border-border p-8">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Star className="h-4 w-4" />
                    Sample Result
                  </div>
                  
                  <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-primary-foreground">92</span>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-foreground">De-escalation Score</div>
                    <div className="text-sm text-muted-foreground mt-1">Candidate: Sarah M.</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-lg font-semibold text-foreground">95%</div>
                      <div className="text-xs text-muted-foreground">Empathy</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground">88%</div>
                      <div className="text-xs text-muted-foreground">Composure</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-amber-600">Top 5%</div>
                      <div className="text-xs text-muted-foreground">Ranking</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
                Why Escalated Stands Out
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-5">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Ultra-Low Latency
                </h3>
                <p className="text-slate-400">
                  WebSocket streams deliver AI responses in under 800ms, making conversations feel 
                  natural and unscripted.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mb-5">
                  <Shield className="h-7 w-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Emotional Intelligence
                </h3>
                <p className="text-slate-400">
                  The AI doesn't just read text—it acts. It responds dynamically to candidate behavior, 
                  creating realistic emotional scenarios.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-5">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Data-Driven Hiring
                </h3>
                <p className="text-slate-400">
                  Transform "I have a good feeling" into "This candidate has a 92% De-escalation Score" 
                  with actionable insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-br from-primary via-green-600 to-primary shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Hiring Process?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Start stress-testing customer service candidates with AI-powered roleplay scenarios today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="h-12 px-8 text-md bg-white text-primary hover:bg-white/90 shadow-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Escalated</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Escalated. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
