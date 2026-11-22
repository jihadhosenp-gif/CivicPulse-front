'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Github, Twitter, Linkedin } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FooterProps {
  className?: string;
}

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'AI Intelligence', href: '#ai-intelligence' },
    { name: 'Interactive Map', href: '#map-preview' },
    { name: 'Report an Issue', href: '/report/new' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Status', href: '#' },
    { name: 'Careers', href: '#' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: <Github className="h-5 w-5" /> },
  { name: 'Twitter', href: 'https://twitter.com', icon: <Twitter className="h-5 w-5" /> },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin className="h-5 w-5" /> },
];

export function Footer({ className }: FooterProps = {}) {
  return (
    <footer
      className={cn('border-t border-input bg-background', className)}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-elegant">
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
              {footerLinks.product.map((link) => (
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
              {footerLinks.company.map((link) => (
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
              {footerLinks.resources.map((link) => (
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
            {socialLinks.map(({ name, href, icon }) => (
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
  );
}
