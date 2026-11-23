"use client";

import * as React from "react";
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
  Users,
  BarChart3,
  Globe,
  Rocket,
  Sparkles,
  Cpu,
  FileText,
} from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Footer } from "@/components/layout/footer";
import { fadeInUp, staggerContainer, staggerItem } from "@/components/motion/variants";
import { mockReports, type Report } from "@/data/mock-dashboard";

const heroStats = [
  { value: "12.4k", label: "Total Reports", icon: Activity },
  { value: "8.9k", label: "Resolved Issues", icon: CheckCircle },
  { value: "47+", label: "Pending Reports", icon: MapPin },
  { value: "99.8k", label: "Active Citizens", icon: Users },
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
    title: "AI Analyzes the Report",
    description: "Google Gemini instantly categorizes, scores severity, and generates a Bengali summary.",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    step: "03",
    title: "Authorities Take Action",
    description: "Authorities triage, assign, and resolve reports while citizens follow progress live.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Road Damage": <MapPin className="h-4 w-4" />,
  Infrastructure: <Shield className="h-4 w-4" />,
  Environmental: <Globe className="h-4 w-4" />,
  Utilities: <Phone className="h-4 w-4" />,
  Sanitation: <Mail className="h-4 w-4" />,
  Vandalism: <Rocket className="h-4 w-4" />,
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ────────────────────────────────────────────────────────────────────────────
 * MapPreview — real React Leaflet map showing Bangladesh report locations.
 * ──────────────────────────────────────────────────────────────────────────── */

interface MapPreviewProps {
  reports: Report[];
}

function MapPreview({ reports }: MapPreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function init() {
      if (cancelled || !containerRef.current) return;
      const L = await import("leaflet");

      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map(containerRef.current).setView([23.6850, 90.3563], 7);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      reports.forEach((report) => {
        const { lat, lng } = report.location;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        L.marker([lat, lng]).addTo(map).bindPopup(report.title);
      });

      requestAnimationFrame(() => map.invalidateSize());
    }

    init().catch((err) => console.error("Map preview failed:", err));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [reports]);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-video rounded-[14px] border border-input bg-surface overflow-hidden"
      style={{ minHeight: "300px" }}
    />
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative"
      >
        <main className="overflow-x-hidden">
          {/* Hero */}
          <section
            className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 overflow-hidden bg-[#F5F8FC]"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium"
                  >
                    AI Analysis Active
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
                  >
                    Report issues. Resolve them together.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[17px] sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
                  >
                    A clean, trusted platform for citizens to report civic problems
                    and for authorities to act — powered by AI and real-time maps.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <Link
                      href="/report/new"
                      className="flex items-center justify-center gap-2 h-[44px] px-6 font-medium bg-accent text-accent-foreground shadow-elegant hover:bg-accent-hover hover:shadow-md rounded-[9px] transition-all"
                    >
                      <ArrowRight className="h-4 w-4" /> Report an Issue
                    </Link>
                    <Link
                      href="/reports"
                      className="flex items-center justify-center gap-2 h-[44px] px-6 font-medium rounded-[9px] border border-input bg-surface hover:bg-accent/50 transition-all"
                    >
                      <Globe className="h-4 w-4" />
                      Explore Reports
                    </Link>
                  </motion.div>
                </div>

                <div className="hidden lg:block relative">
                  <div className="relative rounded-[14px] border border-input bg-surface shadow-lg overflow-hidden">
                    <MapPreview reports={mockReports} />
                  </div>
                  <div className="absolute -left-4 -bottom-4 z-10 flex items-center gap-2 rounded-[14px] border border-input bg-surface px-4 py-3 shadow-xl">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Live activity</p>
                      <p className="text-xs text-muted-foreground">{mockReports.length} reports on the map</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {heroStats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="h-[130px] rounded-[14px] border border-input bg-surface p-5 shadow-elegant"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary mb-3.5">
                        <StatIcon className="h-5 w-5" />
                      </div>
                      <p className="text-[30px] font-bold tracking-tight text-foreground leading-none">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[13px] text-muted-foreground leading-none">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4"
                >
                  How It Works
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Three simple steps from spotting a problem to seeing it resolved.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {howItWorks.map((step) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * Number(step.step) }}
                    className="p-6 rounded-[14px] border border-input bg-surface text-center shadow-elegant"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[12px] bg-primary-soft text-primary mb-5">
                      {step.icon}
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
                      {step.step}
                    </span>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-semibold text-foreground mb-3"
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-muted-foreground leading-relaxed text-sm"
                    >
                      {step.description}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Recent Reports */}
          <section id="recent-reports" className="px-4 py-16 sm:px-6 lg:px-8 bg-[#F1F5F9]/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                  >
                    Recent Reports
                  </motion.h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Latest civic issues reported by the community.
                  </p>
                </div>
                <Link
                  href="/reports"
                  className="flex items-center gap-2 h-[44px] px-4 font-medium rounded-[9px] border border-input bg-surface hover:bg-accent/50 transition-all"
                >
                  View All Reports <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {mockReports.map((report) => (
                  <Card
                    key={report.id}
                    className="h-full flex flex-col rounded-[14px] border border-input bg-surface shadow-elegant hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="aspect-video rounded-t-[12px] border-b border-input/60 bg-secondary relative overflow-hidden">
                      {report.images.length > 0 ? (
                        <img
                          src={report.images[0]}
                          alt={report.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-secondary flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <Badge
                        className="absolute top-2 right-2 z-10"
                        variant={report.status === "resolved" ? "success" : report.status === "rejected" ? "danger" : report.status === "in_progress" ? "accent" : "warning"}
                      >
                        {report.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex-1 flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground truncate">{report.title}</p>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        {categoryIcons[report.category] ?? <FileText className="h-3 w-3" />}
                        <span className="truncate">{report.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {report.location.address}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-3 border-t border-input/60">
                        <StatusBadge status={report.status} />
                        <Link
                          href={`/reports/${report.id}`}
                          className="text-xs font-medium text-accent hover:text-accent/90 transition-colors"
                        >
                          View details
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Map Preview */}
          <section id="map-preview" className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4"
                >
                  Report Locations
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Reports are plotted on a live map so citizens and authorities can
                  see issues near them across Bangladesh.
                </motion.p>
              </div>
              <div className="rounded-[14px] border border-input bg-surface shadow-elegant overflow-hidden">
                <MapPreview reports={mockReports} />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto rounded-[14px] bg-primary p-8 sm:p-12 text-primary-foreground text-center shadow-xl overflow-hidden relative">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 relative z-10"
              >
                Ready to build a smarter community?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-primary-foreground/90 max-w-lg mx-auto leading-relaxed relative z-10"
              >
                Join citizens and municipalities using CivicPulse AI to turn civic
                issues into action.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 relative z-10"
              >
                <Link
                  href="/report/new"
                  className="flex items-center justify-center gap-2 h-[44px] px-8 font-medium bg-[#2478D4] text-[#0F172A] shadow-elegant hover:bg-[#1A6FBD] rounded-[9px] transition-all"
                >
                  <ArrowRight className="h-4 w-4" /> Report an Issue
                </Link>
              </motion.div>
            </div>
          </section>
        </main>
      </motion.div>
      <Footer />
    </div>
  );
}
