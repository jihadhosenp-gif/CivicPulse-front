"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Shield,
  Activity,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Globe,
  Rocket,
  Sparkles,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PremiumCard } from "@/components/ui/card";

const heroStats = [
  { value: "12.4k", label: "Reports Filed", icon: Activity, color: "text-primary" },
  { value: "8.9k", label: "Resolved", icon: CheckCircle, color: "text-success" },
  { value: "4.2h", label: "Avg Response", icon: Clock, color: "text-warning" },
  { value: "47", label: "Cities Live", icon: MapPin, color: "text-navy" },
];

const howItWorks = [
  {
    step: "01",
    title: "Report an Issue",
    description: "Snap a photo, drop a pin on the map, and describe the problem in seconds.",
    icon: <AlertCircle className="h-6 w-6" />,
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Google Gemini instantly categorizes, scores severity, and generates a Bengali summary.",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    step: "03",
    title: "Track & Resolve",
    description: "Authorities triage, assign, and resolve reports while citizens follow progress live.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
];

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Automatic categorization, severity scoring, priority ranking, and Bengali summaries via Google Gemini.",
    icon: <Sparkles className="h-6 w-6" />,
    color: "text-primary",
  },
  {
    title: "Interactive Map",
    description: "Leaflet-powered map with clustered issue markers, heatmaps, and nearby report discovery.",
    icon: <Globe className="h-6 w-6" />,
    color: "text-success",
  },
  {
    title: "Role-Based Access",
    description: "Citizen, Moderator, and Admin roles with granular permissions, audit trails, and secure JWT auth.",
    icon: <Shield className="h-6 w-6" />,
    color: "text-warning",
  },
  {
    title: "Real-Time Dashboard",
    description: "Live analytics, status tracking, and performance metrics for municipalities and citizens.",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "text-navy",
  },
];

const aiIntelligence = [
  {
    title: "Auto Categorization",
    description: "AI reads your report and assigns the correct category — road damage, waterlogging, garbage, and more.",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: "Severity Scoring",
    description: "Machine learning estimates impact and urgency so critical issues get attention first.",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    title: "Bengali Summaries",
    description: "Every report gets a local-language summary so citizens and authorities stay aligned.",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Priority Routing",
    description: "Reports are routed to the right department automatically based on category and severity.",
    icon: <Rocket className="h-5 w-5" />,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-mesh pointer-events-none" />

      <main>
        {/* Hero Section */}
        <section
          className="relative px-4 pt-20 pb-32 sm:pt-24 sm:pb-40 lg:pt-32 lg:pb-48 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  AI Analysis Active
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight"
                >
                  Make Your Community <span className="text-gradient">Better, Together.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
                >
                  Report local problems, understand them with AI, and help create smarter
                  communities. Built for citizens and authorities who care.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href="/report/new"
                    className="flex items-center justify-center gap-2 h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground rounded-lg"
                  >
                    <ArrowRight className="h-5 w-5" /> Report an Issue
                  </Link>
                  <Link
                    href="#platform"
                    className="flex items-center justify-center gap-2 h-12 px-8 font-medium rounded-lg border border-input bg-background hover:bg-accent transition-all"
                  >
                    <Globe className="h-5 w-5" />
                    Explore Platform
                  </Link>
                </motion.div>

                {/* Hero stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-input pt-8"
                >
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl border border-input bg-card shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-semibold tracking-tight uppercase text-muted-foreground">
                          {stat.label}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Hero visual - dashboard preview */}
              <div className="relative hidden lg:block">
                <div className="relative rounded-2xl border border-input bg-card shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                          <span className="text-sm font-bold">C</span>
                        </div>
                        <span className="font-semibold text-foreground">CivicPulse AI</span>
                      </div>
                      <Badge className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success border border-success/20">
                        Live Data
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-secondary">
                        <p className="text-xs text-muted-foreground">Pending Reports</p>
                        <p className="text-lg font-bold text-foreground">24</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary">
                        <p className="text-xs text-muted-foreground">In Progress</p>
                        <p className="text-lg font-bold text-foreground">12</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary">
                        <p className="text-xs text-muted-foreground">Resolved</p>
                        <p className="text-lg font-bold text-foreground">184</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary">
                        <p className="text-xs text-muted-foreground">Avg Response</p>
                        <p className="text-lg font-bold text-foreground">4.2h</p>
                      </div>
                    </div>

                    <div className="h-48 rounded-xl border border-input bg-background p-4 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <MapPin className="h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground">Interactive Map Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-primary/20 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Platform Introduction */}
        <section id="platform" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                A Complete Platform for Civic Issues
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                From submission to resolution, CivicPulse AI gives citizens and municipalities
                the tools to build cleaner, safer, and smarter communities — powered by
                artificial intelligence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">AI-Powered Triage</h3>
                    <p className="text-muted-foreground text-sm">
                      Every report is analyzed by Google Gemini for category, severity, and priority.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Bengali Language Support</h3>
                    <p className="text-muted-foreground text-sm">
                      Local-language summaries make reporting accessible to every citizen.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Real-Time Map</h3>
                    <p className="text-muted-foreground text-sm">
                      Discover and track issues near you with clustered markers and heatmaps.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-mesh pointer-events-none rounded-2xl border border-input" />
                <div className="relative rounded-2xl border border-input bg-card shadow-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Live Dashboard
                      </span>
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-2 w-2 rounded-full bg-muted" />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 rounded-lg border border-input bg-secondary" />
                      ))}
                    </div>
                    <div className="mt-6 h-32 rounded-xl border border-input bg-background" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-4 py-20 bg-secondary/50 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Three simple steps from spotting a problem to seeing it resolved.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step) => (
                <PremiumCard key={step.step} className="p-8 text-center group">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6">
                    {step.icon}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-input text-xs font-semibold text-muted-foreground mb-4">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </PremiumCard>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Built for Modern Communities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Enterprise-grade features designed for citizens, moderators, and administrators.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-8 rounded-xl border border-input bg-card shadow-elegant hover:shadow-lg transition-all group"
                >
                  <div className="p-3 rounded-lg bg-primary/5 text-primary mb-6 group-hover:bg-primary/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Intelligence */}
        <section id="ai-intelligence" className="px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-navy/20 rounded-full blur-3xl" />

            <div className="relative text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Intelligence Behind Every Report
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Google Gemini powers categorization, severity scoring, priority routing, and
                Bengali language summaries — turning raw reports into actionable insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiIntelligence.map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-input bg-card shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Preview */}
        <section id="map-preview" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                See Issues Across Your City
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                An interactive Leaflet map shows clustered issue markers, heatmaps, and nearby
                reports so you can spot patterns and respond faster.
              </p>
            </div>

            <div className="rounded-2xl border border-input bg-card shadow-lg overflow-hidden aspect-[16/9] relative">
              <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Interactive Map Preview</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Leaflet + OpenStreetMap integration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Statistics */}
        <section id="stats" className="px-4 py-20 border-y border-input bg-background/50 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { value: "12.4k", label: "Reports Filed", icon: Activity, color: "text-primary" },
                { value: "8.9k", label: "Reports Resolved", icon: CheckCircle, color: "text-success" },
                { value: "4.2h", label: "Average Response Time", icon: Clock, color: "text-warning" },
                { value: "47+", label: "Cities & Towns Live", icon: MapPin, color: "text-navy" },
                { value: "99.8%", label: "AI Categorization Accuracy", icon: Cpu, color: "text-primary" },
                { value: "24/7", label: "Citizen Reporting", icon: Phone, color: "text-success" },
              ].map((stat) => (
                <div key={stat.label} className="p-8 rounded-xl border border-input bg-card shadow-elegant text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-semibold tracking-tight uppercase text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-hero p-8 md:p-16 text-white text-center shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 relative z-10">
              Ready to Build a Smarter Community?
            </h2>
            <p className="text-lg text-white/90 mb-10 max-w-lg mx-auto leading-relaxed relative z-10">
              Join municipalities using CivicPulse AI to turn civic issues into action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="/report/new"
                className="flex items-center justify-center gap-2 h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all bg-white text-primary rounded-lg"
              >
                <ArrowRight className="h-5 w-5" />
                Report an Issue
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 h-12 px-8 font-medium border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all rounded-lg"
              >
                <Mail className="h-5 w-5" />
                Explore Platform
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}