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

// Fixed premium dark footer per spec: bg #0F172A, headings #F8FAFC, body #CBD5E1, divider #334155.
export function Footer({ className }: FooterProps = {}) {
  return (
    <footer
      className={cn('border-t border-[#334155] bg-[#0F172A]', className)}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#2478D4] text-[#0F172A] shadow-elegant">
                <span className="text-sm font-bold tracking-tight">C</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-[#F8FAFC]">
                CivicPulse<span className="text-[#2478D4]">AI</span>
              </span>
            </div>
            <p className="text-[#CBD5E1] max-w-sm leading-relaxed">
              AI-powered civic issue reporting and management. Building smarter communities,
              one report at a time.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="mailto:hello@civicpulse.ai"
                className="flex items-center gap-2 text-sm text-[#CBD5E1] hover:text-[#2478D4] transition-colors"
              >
                <Mail className="h-4 w-4" />
                hello@civicpulse.ai
              </a>
              <a
                href="tel:+8801XXXXXXXX"
                className="flex items-center gap-2 text-sm text-[#CBD5E1] hover:text-[#2478D4] transition-colors"
              >
                <Phone className="h-4 w-4" />
                +880 1XXXXXXXX
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#F8FAFC] mb-6 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-[#CBD5E1]">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#2478D4] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#F8FAFC] mb-6 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-[#CBD5E1]">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#2478D4] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#F8FAFC] mb-6 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-[#CBD5E1]">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#2478D4] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#334155] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#CBD5E1]">
            {'© '} {new Date().getFullYear()} CivicPulse AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            {socialLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CBD5E1] hover:text-[#2478D4] transition-colors"
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
