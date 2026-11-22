"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Users,
  BarChart3,
  Globe,
  Rocket,
  Sparkles,
  Cpu,
  Menu,
  X,
  Play,
  Eye,
  Sun,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer, staggerItem, pageVariants, pageTransition } from "@/components/motion/variants";

const navLinks = [
  { name: "Platform", href: "#platform" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
  { name: "AI Intelligence", href: "#ai-intelligence" },
  { name: "Stats", href: "#stats" },
];

const heroStats = [
  { value: "12.4k", label: "Reports Filed", icon: Activity, color: "text-primary" },
  { value: "8.9k", label: "Resolved", icon: CheckCircle, color: "text-success" },
  { value: "4.2h", label: "Avg Response", icon: Clock, color: "text-warning" },
  { value: "47+", label: "Cities Live", icon: MapPin, color: "text-navy" },
];

const howItWorks = [
  {
    step: "01",
    title: "Report an Issue",
    description: "Snap a photo, drop a pin on the map, and describe the problem in seconds.",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Google Gemini instantly categorizes, scores severity, and generates a Bengali summary.",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    step: "03",
    title: "Track & Resolve",
    description: "Authorities triage, assign, and resolve reports while citizens follow progress live.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Automatic categorization, severity scoring, priority ranking, and Bengali summaries via Google Gemini.",
    icon: <Sparkles className="h-5 w-5" />,
    color: "text-primary",
  },
  {
    title: "Interactive Map",
    description: "Leaflet-powered map with clustered issue markers, heatmaps, and nearby report discovery.",
    icon: <Globe className="h-5 w-5" />,
    color: "text-success",
  },
  {
    title: "Role-Based Access",
    description: "Citizen, Moderator, and Admin roles with granular permissions, audit trails, and secure JWT auth.",
    icon: <Shield className="h-5 w-5" />,
    color: "text-warning",
  },
  {
    title: "Real-Time Dashboard",
    description: "Live analytics, status tracking, and performance metrics for municipalities and citizens.",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-navy",
  },
];

const aiIntelligence = [
  {
    title: "Auto Categorization",
    description: "AI reads your report and assigns the correct category.",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    title: "Severity Scoring",
    description: "ML estimates impact so critical issues get attention first.",
    icon: <AlertTriangleAlt className="h-4 w-4" />,
  },
  {
    title: "Bengali Summaries",
    description: "Local-language summaries keep citizens and authorities aligned.",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    title: "Priority Routing",
    description: "Reports are routed to the right department automatically.",
    icon: <Rocket className="h-4 w-4" />,
  },
];

const statCards = [
  { value: "12.4k", label: "Reports Filed", icon: Activity, color: "text-primary" },
  { value: "8.9k", label: "Reports Resolved", icon: CheckCircle, color: "text-success" },
  { value: "4.2h", label: "Average Response Time", icon: Clock, color: "text-warning" },
  { value: "47+", label: "Cities & Towns Live", icon: MapPin, color: "text-navy" },
  { value: "99.8%", label: "AI Categorization Accuracy", icon: Cpu, color: "text-primary" },
  { value: "24/7", label: "Citizen Reporting", icon: Phone, color: "text-success" },
];

function AlertTriangleAlt({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

export default function LandingPage() {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-mesh pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-72 h-72 bg-navy/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative"
      >
        {/* Premium Navigation */}
        <nav
          className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 border-b border-input bg-background/80 backdrop-blur-md transition-all"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
              <span className="text-sm font-bold tracking-tight">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              CivicPulse<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggleBtn />
            <Link
              href="/report/new"
              className="hidden sm:flex items-center justify-center gap-2 h-10 px-5 font-medium shadow-elegant hover:shadow-md transition-all bg-primary text-primary-foreground rounded-xl"
            >
              <ArrowRight className="h-4 w-4" /> Report an Issue
            </Link>
            <Link
              href="/login"
              className="hidden sm:flex items-center justify-center gap-2 h-10 px-5 font-medium rounded-xl border border-input bg-background hover:bg-accent transition-all"
            >
              <Mail className="h-4 w-4" /> Login
            </Link>
            <button
              className="lg:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              aria-label="Open menu"
              onClick={() => setNavOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
              onClick={() => setNavOpen(false)}
            />
          )}
          {navOpen && (
            <motion.div
              initial={{ translateX: "-100%" }}
              animate={{ translateX: 0 }}
              exit={{ translateX: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-full sm:max-w-xs bg-card border-r border-input shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-input">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-elegant">
                    <span className="text-sm font-bold tracking-tight">C</span>
                  </div>
                  <span className="font-bold text-lg tracking-tight text-foreground">
                    CivicPulse<span className="text-primary">AI</span>
                  </span>
                </Link>
                <button
                  className="rounded-lg p-1.5 hover:bg-accent transition-colors"
                  onClick={() => setNavOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="px-6 py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setNavOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto px-6 py-8 space-y-3">
                <Link
                  href="/report/new"
                  className="flex items-center justify-center gap-2 h-11 px-5 font-medium shadow-elegant hover:shadow-md transition-all bg-primary text-primary-foreground rounded-xl w-full"
                >
                  <ArrowRight className="h-4 w-4" /> Report an Issue
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 h-11 px-5 font-medium rounded-xl border border-input bg-background hover:bg-accent transition-all w-full"
                >
                  <Mail className="h-4 w-4" /> Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          {/* Hero Section */}
          <section
            className="relative px-4 pt-20 pb-32 sm:pt-24 sm:pb-40 lg:pt-36 lg:pb-52 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    AI Analysis Active
                  </motion.div>

                  <motion.h1
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight"
                  >
                    Make Your Community <span className="text-gradient">Better, Together.</span>
                  </motion.h1>

                  <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
                  >
                    Report local problems, understand them with AI, and help create smarter
                    communities. Built for citizens and authorities who care.
                  </motion.p>

                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Link
                      href="/report/new"
                      className="flex items-center justify-center gap-2 h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground rounded-xl"
                    >
                      <ArrowRight className="h-5 w-5" /> Report an Issue
                    </Link>
                    <Link
                      href="#platform"
                      className="flex items-center justify-center gap-2 h-12 px-8 font-medium rounded-xl border border-input bg-background hover:bg-accent transition-all"
                    >
                      <Globe className="h-5 w-5" />
                      Explore Platform
                    </Link>
                  </motion.div>

                  {/* Hero stats */}
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-input pt-8"
                  >
                    {heroStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 rounded-2xl border border-input bg-card shadow-elegant"
                      >
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
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative rounded-3xl border border-input bg-card shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
                    <div className="relative p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white">
                            <span className="text-sm font-bold">C</span>
                          </div>
                          <span className="font-semibold text-foreground">CivicPulse AI</span>
                        </div>
                        <Badge className="px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success border border-success/20">
                          Live Data
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <StatPreview title="Pending Reports" value="24" color="text-warning" />
                        <StatPreview title="In Progress" value="12" color="text-primary" />
                        <StatPreview title="Resolved" value="184" color="text-success" />
                        <StatPreview title="Avg Response" value="4.2h" color="text-navy" />
                      </div>

                      <div className="h-64 rounded-2xl border border-input bg-background p-6 flex flex-col items-center justify-center gap-3">
                        <MapPin className="h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground">Interactive Map Preview</p>
                        <div className="h-8 w-8 rounded-full border border-input bg-muted animate-pulse" />
                      </div>
            </div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/20 blur-[64px]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Platform Introduction */}
          <section id="platform" className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <motion.h2
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
                >
                  A Complete Platform for Civic Issues
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  From submission to resolution, CivicPulse AI gives citizens and municipalities
                  the tools to build cleaner, safer, and smarter communities — powered by
                  artificial intelligence.
                </motion.p>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <FeatureRow
                    icon={<Shield className="h-5 w-5" />}
                    color="text-primary"
                    title="AI-Powered Triage"
                    description="Every report is analyzed by Google Gemini for category, severity, and priority."
                  />
                  <FeatureRow
                    icon={<CheckCircle className="h-5 w-5" />}
                    color="text-success"
                    title="Bengali Language Support"
                    description="Local-language summaries make reporting accessible to every citizen."
                  />
                  <FeatureRow
                    icon={<MapPin className="h-5 w-5" />}
                    color="text-warning"
                    title="Real-Time Map"
                    description="Discover and track issues near you with clustered markers and heatmaps."
                  />
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-mesh pointer-events-none rounded-3xl border border-input" />
                  <div className="relative rounded-3xl border border-input bg-card shadow-2xl overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Live Dashboard
                        </span>
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="h-2 w-2 rounded-full bg-input" />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-24 rounded-2xl border border-input bg-secondary" />
                        ))}
                      </div>
                      <div className="mt-8 h-40 rounded-2xl border border-input bg-background" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="px-4 py-20 bg-secondary/40 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
                >
                  How It Works
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Three simple steps from spotting a problem to seeing it resolved.
</motion.p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {howItWorks.map((step) => (
                  <motion.div
                    variants={staggerItem}
                    key={step.step}
                    className="p-8 rounded-3xl border border-input bg-card shadow-elegant text-center group"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6">
                      {step.icon}
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-input text-xs font-semibold text-muted-foreground mb-4">
                      {step.step}
                    </span>
                    <motion.h3
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="text-xl font-semibold text-foreground mb-3"
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 }}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {step.description}
                    </motion.p>
</motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
                >
                  Built for Modern Communities
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Enterprise-grade features designed for citizens, moderators, and administrators.
                </motion.p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {features.map((feature) => (
                  <motion.div
                    variants={staggerItem}
                    key={feature.title}
                    className="p-8 rounded-3xl border border-input bg-card shadow-elegant hover:shadow-lg transition-all group"
                  >
                    <div className="p-3 rounded-xl bg-primary/5 text-primary mb-6 group-hover:bg-primary/10 transition-colors">
                      {feature.icon}
                    </div>
                    <motion.h3
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="text-xl font-semibold text-foreground mb-3"
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 }}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {feature.description}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* AI Intelligence */}
          <section id="ai-intelligence" className="px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-navy/20 rounded-full blur-[100px]" />

              <div className="relative text-center mb-16">
                <motion.h2
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
                >
                  Intelligence Behind Every Report
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Google Gemini powers categorization, severity scoring, priority routing, and
                  Bengali language summaries — turning raw reports into actionable insights.
                </motion.p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {aiIntelligence.map((item) => (
                  <motion.div
                    variants={staggerItem}
                    key={item.title}
                    className="p-6 rounded-3xl border border-input bg-card shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                      {item.icon}
                    </div>
                    <motion.h3
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="text-lg font-semibold text-foreground mb-2"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 }}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {item.description}
                    </motion.p>
</motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Platform Statistics */}
          <section id="stats" className="px-4 py-20 border-y border-input bg-background/50 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {statCards.map((stat) => (
                  <motion.div
                    variants={staggerItem}
                    key={stat.label}
                    className="p-8 rounded-3xl border border-input bg-card shadow-elegant text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs font-semibold tracking-tight uppercase text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Call To Action */}
          <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-hero p-8 md:p-16 text-white text-center shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
              <motion.h2
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-3xl md:text-5xl font-bold tracking-tight mb-6 relative z-10"
              >
                Ready to Build a Smarter Community?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="text-lg text-white/90 mb-10 max-w-lg mx-auto leading-relaxed relative z-10"
              >
                Join municipalities using CivicPulse AI to turn civic issues into action.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
              >
                <Link
                  href="/report/new"
                  className="flex items-center justify-center gap-2 h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all bg-white text-primary rounded-xl"
                >
                  <ArrowRight className="h-5 w-5" />
                  Report an Issue
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 h-12 px-8 font-medium border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all rounded-xl"
                >
                  <Mail className="h-5 w-5" />
                  Explore Platform
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Premium Footer */}
        <footer className="border-t border-input bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-elegant">
                    <span className="text-sm font-bold tracking-tight">C</span>
                  </div>
                  <span className="font-bold text-xl tracking-tight text-foreground">
                    CivicPulse<span className="text-primary">AI</span>
                  </span>
                </div>
                <p className="text-muted-foreground max-w-sm leading-relaxed">
                  AI-powered civic issue reporting and management. Building smarter communities,
                  one report at a time.
                </p>
                <div className="mt-6 flex gap-4">
                  <a
                    href="mailto:hello@civicpulse.ai"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    hello@civicpulse.ai
                  </a>
                  <a
                    href="tel:+8801XXXXXXXX"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    +880 1XXXXXXXX
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
                  Product
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    { name: "Features", href: "#features" },
                    { name: "AI Intelligence", href: "#ai-intelligence" },
                    { name: "Interactive Map", href: "#map-preview" },
                    { name: "Report an Issue", href: "/report/new" },
                  ].map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
                  Company
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    { name: "About", href: "#" },
                    { name: "Contact", href: "#" },
                    { name: "Privacy", href: "#" },
                    { name: "Terms", href: "#" },
                  ].map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
                  Resources
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    { name: "Documentation", href: "#" },
                    { name: "API Reference", href: "#" },
                    { name: "Status", href: "#" },
                    { name: "Careers", href: "#" },
                  ].map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-input pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {'© '} {new Date().getFullYear()} CivicPulse AI. All rights reserved.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "GitHub", href: "https://github.com", icon: <GithubIcon /> },
                  { name: "Twitter", href: "https://twitter.com", icon: <TwitterIcon /> },
                  { name: "LinkedIn", href: "https://linkedin.com", icon: <LinkedinIcon /> },
                ].map(({ name, href, icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={name}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

function ThemeToggleBtn() {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-elegant transition-all hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      aria-label="Theme mode"
      title="Theme mode"
    >
      <Sun className="h-5 w-5" />
      <span className="text-muted-foreground">Light</span>
    </button>
  );
}

function StatPreview({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-secondary">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function FeatureRow({
  icon,
  color,
  title,
  description,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
