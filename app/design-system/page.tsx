"use client";

import {
  Button,
} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  PremiumCard,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Sun,
  Moon,
  Layers,
} from 'lucide-react';

const variants = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'soft',
  'softDestructive',
  'softSuccess',
  'navy',
];

const sizes = ['sm', 'default', 'lg', 'icon'];

const spacingTokens = [
  { name: 'space-0', value: '0', label: '0px' },
  { name: 'space-xs', value: 'var(--space-xs)', label: '4px' },
  { name: 'space-sm', value: 'var(--space-sm)', label: '8px' },
  { name: 'space-base', value: 'var(--space-base)', label: '16px' },
  { name: 'space-md', value: 'var(--space-md)', label: '24px' },
  { name: 'space-lg', value: 'var(--space-lg)', label: '32px' },
  { name: 'space-xl', value: 'var(--space-xl)', label: '48px' },
  { name: 'space-2xl', value: 'var(--space-2xl)', label: '64px' },
  { name: 'space-3xl', value: 'var(--space-3xl)', label: '96px' },
];

const radiusTokens = [
  { name: 'radius-sm', value: 'var(--radius-sm)', label: '0.5rem' },
  { name: 'radius', value: 'var(--radius)', label: '0.75rem' },
  { name: 'radius-lg', value: 'var(--radius-lg)', label: '1rem' },
  { name: 'radius-xl', value: 'var(--radius-xl)', label: '1.5rem' },
  { name: 'radius-full', value: 'var(--radius-full)', label: '9999px' },
];

const shadowTokens = [
  { name: 'shadow-sm', label: 'Subtle', className: 'shadow-sm' },
  { name: 'shadow', label: 'Default', className: 'shadow-elegant' },
  { name: 'shadow-md', label: 'Medium', className: 'shadow-md' },
  { name: 'shadow-lg', label: 'Large', className: 'shadow-lg' },
  { name: 'shadow-xl', label: 'Extra Large', className: 'shadow-xl' },
];

function ColorSwatch({ name, value, className }: { name: string; value: string; className?: string }) {
  return (
    <div className="rounded-lg border border-input p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-3 w-3 rounded-full border border-input" style={{ backgroundColor: value }} />
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <div className="h-8 rounded-lg border border-input" style={{ backgroundColor: value }} />
      <p className="text-xs text-muted-foreground mt-2 font-mono">{value}</p>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-input pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Layers className="h-3 w-3" />
            Design System v1.0
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">CivicPulse AI</h1>
          <p className="text-muted-foreground text-lg">
            Premium component reference and design tokens for the CivicPulse AI platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle className="px-4" />
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Mail className="h-4 w-4" />
            Back to app
          </Link>
        </div>
      </header>

      {/* Theme */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Light &amp; Dark Themes</h2>
            <p className="text-muted-foreground">
              CivicPulse AI supports light and dark themes, persisted via localStorage and
              respecting the system preference.
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-input bg-background shadow-elegant">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sun className="h-4 w-4 text-warning" /> Light
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#FFFFFF' }} />
                <span className="text-sm text-muted-foreground">Background / Surface</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#F8FAFC' }} />
                <span className="text-sm text-muted-foreground">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#0F172A' }} />
                <span className="text-sm text-muted-foreground">Text</span>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-slate-700 bg-[#0B1120] text-slate-50 shadow-elegant">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Moon className="h-4 w-4 text-warning" /> Dark
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#0B1120' }} />
                <span className="text-sm text-slate-300">Background</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#111C31' }} />
                <span className="text-sm text-slate-300">Card / Surface</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#1E293B' }} />
                <span className="text-sm text-slate-300">Elevated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#F8FAFC' }} />
                <span className="text-sm text-slate-300">Text</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Color Palette</h2>
        <p className="text-muted-foreground mb-6">
          Semantic color tokens mapped to the CivicPulse AI brand. Use these tokens consistently
          across all pages and components.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch name="Primary" value="hsl(var(--primary))" />
          <ColorSwatch name="Background" value="hsl(var(--background))" />
          <ColorSwatch name="Secondary" value="hsl(var(--secondary-background))" />
          <ColorSwatch name="Surface" value="hsl(var(--surface))" />
          <ColorSwatch name="Main text" value="hsl(var(--foreground))" />
          <ColorSwatch name="Secondary text" value="hsl(var(--muted-foreground))" />
          <ColorSwatch name="Muted text" value="hsl(var(--text-muted))" />
          <ColorSwatch name="Border" value="hsl(var(--border))" />
          <ColorSwatch name="Success" value="hsl(var(--success))" />
          <ColorSwatch name="Warning" value="hsl(var(--warning))" />
          <ColorSwatch name="Danger" value="hsl(var(--danger))" />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Typography</h2>
        <p className="text-muted-foreground mb-6">
          Inter is the primary typeface. Headings use tight tracking for elegance; body text uses
          relaxed leading for readability.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-6xl font-bold tracking-tight text-foreground">H1 / 6xl</p>
            <p className="text-muted-foreground text-sm mt-2">Primary page headings</p>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight text-foreground">H2 / 4xl</p>
            <p className="text-muted-foreground text-sm mt-2">Section headings</p>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">H3 / 3xl</p>
            <p className="text-muted-foreground text-sm mt-2">Card titles</p>
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight text-foreground">H4 / xl</p>
            <p className="text-muted-foreground text-sm mt-2">Subsection headings</p>
          </div>
          <div className="col-span-2 md:col-span-4">
            <p className="text-base leading-relaxed text-foreground">
              Body text uses 1rem / 1.5 line height with -0.01em letter tracking for optimal readability at scale.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground mt-2">
              Muted text for captions, metadata, and secondary information.
            </p>
          </div>
        </div>
      </section>

      {/* Spacing System */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Spacing System</h2>
        <p className="text-muted-foreground mb-6">
          A consistent spatial scale ensures rhythm and balance across the product. Tokens are
          exposed as CSS variables (--space-*) and Tailwind utilities (space-xs, space-base, etc.).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {spacingTokens.map((token) => (
            <div
              key={token.name}
              className="rounded-lg border border-input p-4 flex flex-col items-center justify-between"
              style={{ height: '120px' }}
            >
              <div className="w-full h-1 rounded-lg border border-input mb-3" style={{ backgroundColor: 'hsl(var(--border))' }} />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{token.label}</span>
              </div>
              <p className="text-[0.7rem] font-medium text-foreground mt-auto">{token.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Border Radius</h2>
        <p className="text-muted-foreground mb-6">
          Consistent border radii create a unified visual language. All components use one of these
          five values.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {radiusTokens.map((token) => (
            <div key={token.name} className="flex flex-col items-center gap-3">
              <div
                className="h-12 w-12 rounded border border-input bg-card flex items-center justify-center"
                style={{
                  borderRadius: token.value,
                  backgroundColor: 'hsl(var(--card))',
                }}
              >
                <span className="text-[0.65rem] font-medium text-muted-foreground">{token.label}</span>
              </div>
              <p className="text-[0.7rem] font-medium text-foreground">{token.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Shadow System</h2>
        <p className="text-muted-foreground mb-6">
          Subtle, layered shadows add depth without heaviness. Avoid hard borders; use shadows to
          communicate elevation.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {shadowTokens.map((token) => (
            <div key={token.name} className="flex flex-col items-center gap-3 p-4">
              <div className={`h-16 w-24 rounded-lg border border-input bg-card flex items-center justify-center ${token.className}`}>
                <span className="text-xs font-medium text-muted-foreground">Elevation</span>
              </div>
              <p className="text-[0.7rem] font-medium text-foreground">{token.name}</p>
              <p className="text-xs text-muted-foreground">{token.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Buttons</h2>
        <p className="text-muted-foreground mb-6">
          Nine variants across four sizes. Primary actions use solid fills; secondary actions use
          outlines or soft fills.
        </p>
        <div className="space-y-8">
          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {sizes.map((size) => (
                  <Button key={size} variant={variant as any} size={size as any}>
                    {size}
                  </Button>
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-mono">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Inputs</h2>
        <p className="text-muted-foreground mb-6">
          Clean, border-based inputs with clear focus states. Pair every input with a Label.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="name@civicpulse.ai" />
            <p className="text-xs text-muted-foreground">We'll never share your email.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Report title</Label>
            <Input id="title" placeholder="Broken streetlight on Main St" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Input id="search" placeholder="Search reports…" className="pl-10" />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" placeholder="+880 1XXX XXXXXX" />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Cards</h2>
        <p className="text-muted-foreground mb-6">
          Two card types: the standard Card for general content, and PremiumCard for featured
          content with elevated hover states.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>42 reports awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">View All</Button>
            </CardFooter>
          </Card>

          <PremiumCard className="p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Severity</p>
                <h3 className="text-xl font-bold">Waterlogging - District 5</h3>
              </div>
              <Badge variant="danger" size="sm">Critical</Badge>
            </div>
            <p className="mt-4 text-muted-foreground">Reported 2 hours ago • 12 upvotes</p>
          </PremiumCard>

          <Card className="p-6 bg-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="text-sm">Category auto-confirmed: Road Damage</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status Badges */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Status Badges</h2>
        <p className="text-muted-foreground mb-6">
          Compact labels for status, severity, and category. Use semantic variants for meaning.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Default', variant: 'default' },
            { label: 'Secondary', variant: 'secondary' },
            { label: 'Destructive', variant: 'destructive' },
            { label: 'Outline', variant: 'outline' },
            { label: 'Success', variant: 'success' },
            { label: 'Warning', variant: 'warning' },
            { label: 'Danger', variant: 'danger' },
            { label: 'Navy', variant: 'navy' },
            { label: 'Ghost', variant: 'ghost' },
          ].map((b) => (
            <Badge key={b.label} variant={b.variant as any}>
              {b.label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Modal */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Modal (Dialog)</h2>
        <p className="text-muted-foreground mb-6">
          Centered overlays for focused tasks. Use soft overlays and smooth scale-in animation.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to mark this report as resolved?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button>Resolve Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Dropdown */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Dropdown (Select)</h2>
        <p className="text-muted-foreground mb-6">
          Accessible select component with search-friendly trigger and animated content panel.
        </p>
        <div className="flex flex-col gap-4 w-64">
          <Label htmlFor="category">Report Category</Label>
          <Select defaultValue="road">
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="road">Road Damage</SelectItem>
              <SelectItem value="garbage">Garbage &amp; Waste</SelectItem>
              <SelectItem value="waterlogging">Waterlogging</SelectItem>
              <SelectItem value="streetlight">Broken Streetlight</SelectItem>
              <SelectItem value="water">Water Supply</SelectItem>
              <SelectItem value="safety">Public Safety</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Drawer */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Drawer (Sheet)</h2>
        <p className="text-muted-foreground mb-6">
          Slide-over panels for secondary tasks and detailed views without leaving the page.
        </p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Report Details</SheetTitle>
              <SheetDescription>
                Manage report status and assignment.
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="warning" size="sm">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assignee</span>
                <span className="text-sm font-medium">John Admin</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" className="w-full">Close</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </section>

      {/* Premium Status Cards */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Premium Status Cards</h2>
        <p className="text-muted-foreground mb-6">
          Metric cards with icons, deltas, and subtle hover elevation for dashboards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{
            title: 'Pending',
            count: '24',
            icon: <AlertCircle className="h-5 w-5" />,
            color: 'text-warning',
            subtitle: 'Awaiting triage',
          }, {
            title: 'In Progress',
            count: '12',
            icon: <Clock className="h-5 w-5" />,
            color: 'text-primary',
            subtitle: 'Being resolved',
          }, {
            title: 'Resolved',
            count: '184',
            icon: <CheckCircle className="h-5 w-5" />,
            color: 'text-success',
            subtitle: 'Successfully closed',
          }].map((card) => (
            <PremiumCard key={card.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                  <h3 className="text-2xl font-bold text-foreground">{card.title}</h3>
                </div>
                <div className="p-2 rounded-lg bg-[hsl(var(--border))]">
                  {card.icon}
                </div>
              </div>
              <div className="mt-6 text-4xl font-bold text-foreground">{card.count}</div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`${card.color} font-medium`}>
                  {card.title === 'Resolved' ? '+12.5%' : '-5.2%'}
                </span>
                <span>vs last week</span>
              </div>
            </PremiumCard>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Navigation</h2>
        <p className="text-muted-foreground mb-6">
          The sidebar and navbar are used globally via app/layout.tsx. The sidebar collapses to
          icon-only mode and includes the theme toggle.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg border border-input bg-card text-sm font-medium hover:bg-accent transition-colors">
            Dashboard
          </Link>
          <Link href="/map" className="px-4 py-2 rounded-lg border border-input bg-card text-sm font-medium hover:bg-accent transition-colors">
            Map
          </Link>
          <Link href="/reports" className="px-4 py-2 rounded-lg border border-input bg-card text-sm font-medium hover:bg-accent transition-colors">
            Reports
          </Link>
        </div>
      </section>
    </div>
  );
}
