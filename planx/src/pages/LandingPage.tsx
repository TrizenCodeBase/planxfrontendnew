import { Link } from 'react-router-dom'
import {
  LayoutGrid,
  Layers,
  ListTodo,
  Building2,
  BarChart3,
  Shield,
  FileText,
  Monitor,
  Sparkles,
  Lock,
  Users,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { HeroMockup, DashboardPreviewGrid } from '@/components/landing/ProductMockup'
import { ContactSection } from '@/components/landing/ContactSection'
import {
  TRUST_COMPANIES,
  CURRENT_FEATURES,
  AI_FEATURES,
  INTEGRATIONS,
  PRICING_TIERS,
  TESTIMONIALS,
  SECURITY_FEATURES,
  FOOTER_LINKS,
} from '@/mock/landing'

const featureIcons = [
  LayoutGrid,
  Layers,
  ListTodo,
  Building2,
  BarChart3,
  Shield,
  FileText,
  Monitor,
]

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#ai', label: 'AI Roadmap' },
  { href: '#security', label: 'Security' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

function AiBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    'Coming Soon': 'bg-slate-100 text-slate-600 border-slate-200',
    'AI Powered': 'bg-blue-50 text-[var(--color-primary)] border-blue-200',
    Beta: 'bg-violet-50 text-violet-700 border-violet-200',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded border ${styles[label] ?? styles['Coming Soon']}`}>
      {label}
    </span>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string
  title: string
  description: string
  align?: 'center' | 'left'
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-2xl mb-12 ${alignClass}`}>
      <p className="text-sm font-medium text-[var(--color-primary)]">{eyebrow}</p>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--color-text)] mt-2 tracking-tight">
        {title}
      </h2>
      <p className="text-[var(--color-text-muted)] mt-3 leading-relaxed">{description}</p>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <header className="sticky top-0 z-50 bg-white/95 border-b border-[var(--color-border)] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
              P
            </span>
            <span className="font-display font-semibold text-[var(--color-text)]">PlanX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-[var(--color-primary)] transition-colors duration-150">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <a href="#contact">
              <Button size="sm">Book demo</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Enterprise collaboration, rebuilt for AI-era teams
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-[var(--color-text)] mt-6 leading-[1.12] tracking-tight">
                Ship faster with clarity across every role
              </h1>
              <p className="text-lg text-[var(--color-text-muted)] mt-5 leading-relaxed max-w-lg">
                PlanX is an AI-powered enterprise collaboration and project management platform for modern
                organizations — from sprint planning to secure multi-org governance.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#contact">
                  <Button className="px-5 py-2">
                    Start free trial
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </a>
                <Link to="/login">
                  <Button variant="secondary" className="px-5 py-2">
                    View live demo
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-4">
                No credit card · SSO-ready · Built by Trizen HR
              </p>
            </div>
            <HeroMockup />
          </div>

          <div className="mt-16 pt-10 border-t border-[var(--color-border)]">
            <p className="text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-6">
              Trusted by forward-thinking teams
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {TRUST_COMPANIES.map((name) => (
                <span
                  key={name}
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-150"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Platform capabilities"
            title="Everything your delivery org needs today"
            description="PlanX unifies planning, execution, and governance in one workspace — designed for managers, contributors, and executives alike."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURRENT_FEATURES.map((f, i) => {
              const Icon = featureIcons[i] ?? LayoutGrid
              return (
                <article
                  key={f.title}
                  className="bg-white border border-[var(--color-border)] rounded-lg p-5 hover:border-[var(--color-primary)]/40 transition-colors duration-150"
                >
                  <div className="w-9 h-9 rounded-[var(--radius-control)] bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)]">{f.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">{f.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI */}
      <section id="ai" className="py-20 px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <SectionHeader
                align="left"
                eyebrow="AI roadmap"
                title="Intelligence layered into your workflow"
                description="Upcoming AI capabilities augment — never replace — your team's judgment. Early access rolls out to Growth and Enterprise customers first."
              />
              <a href="#contact" className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:underline mt-2">
                Join the AI waitlist
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              {AI_FEATURES.map((f) => (
                <article
                  key={f.title}
                  className="relative pl-4 border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-muted)] rounded-r-lg p-5 hover:bg-white hover:border-[var(--color-border)] hover:shadow-sm transition-all duration-150"
                >
                  <AiBadge label={f.badge} />
                  <h3 className="font-semibold text-[var(--color-text)] mt-3">{f.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">{f.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section id="preview" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Product preview"
            title="One pane for analytics, boards, and org health"
            description="Leaders see velocity and risk; teams stay in flow on kanban and sprints — without switching tools."
          />
          <DashboardPreviewGrid />
        </div>
      </section>

      {/* Enterprise security */}
      <section id="security" className="py-20 px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Enterprise security"
            title="Governance built for regulated teams"
            description="Auditability and access control are first-class — not add-ons. PlanX helps security and IT teams sleep at night."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECURITY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-muted)] hover:bg-white transition-colors duration-150"
              >
                <Lock className="w-5 h-5 text-[var(--color-primary)] mb-3" />
                <h3 className="font-semibold text-[var(--color-text)]">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <SectionHeader
            eyebrow="Integrations"
            title="Connect the tools your teams already use"
            description="Slack, GitHub, design, and meeting tools — planned integrations keep context in sync without duplicate entry."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((name) => (
              <div
                key={name}
                className="px-5 py-3 bg-white border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)]/50 transition-colors duration-150"
              >
                {name}
                <span className="ml-2 text-[10px] text-[var(--color-text-muted)] font-normal">Soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Pricing"
            title="Plans that scale with your organization"
            description="Transparent per-seat pricing for teams; custom contracts for enterprise compliance and AI roadmap access."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border p-6 flex flex-col ${
                  tier.highlighted
                    ? 'border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]/20 bg-white'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-muted)]'
                }`}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{tier.description}</p>
                <p className="mt-4">
                  <span className="text-3xl font-semibold text-[var(--color-text)]">{tier.price}</span>
                  {tier.price !== 'Custom' && (
                    <span className="text-sm text-[var(--color-text-muted)] ml-1">/{tier.period}</span>
                  )}
                </p>
                {tier.price === 'Custom' && (
                  <p className="text-sm text-[var(--color-text-muted)]">{tier.period}</p>
                )}
                <ul className="mt-6 space-y-2 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex gap-2 text-sm text-[var(--color-text-muted)]">
                      <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-6 block">
                  <Button variant={tier.highlighted ? 'primary' : 'secondary'} className="w-full">
                    {tier.cta}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Customer stories"
            title="Teams shipping with confidence"
            description="From startups to multi-division enterprises, PlanX keeps delivery visible and secure."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={t.name}
                className={`bg-white border border-[var(--color-border)] rounded-lg p-6 ${i === 1 ? 'md:-translate-y-2' : ''}`}
              >
                <p className="text-[var(--color-text)] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/15 flex items-center justify-center text-sm font-semibold text-[var(--color-primary)]">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <cite className="not-italic font-medium text-sm text-[var(--color-text)]">{t.name}</cite>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-role callout */}
      <section className="py-16 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto bg-[var(--color-primary)] rounded-lg px-8 py-10 sm:py-12 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Users className="w-10 h-10 shrink-0 opacity-90" />
            <div>
              <h2 className="font-display text-2xl font-semibold">Built for every seat at the table</h2>
              <p className="text-white/85 mt-2 max-w-xl text-sm leading-relaxed">
                System admins, org admins, managers, members, and viewers each get tailored workspaces — one platform,
                zero permission sprawl.
              </p>
            </div>
          </div>
          <Link to="/login">
            <Button variant="secondary" className="bg-white text-[var(--color-primary)] border-white hover:bg-white/90 shrink-0">
              Explore demo roles
            </Button>
          </Link>
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--color-border)] py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
                  P
                </span>
                <span className="font-display font-semibold">PlanX</span>
              </Link>
              <p className="text-sm text-[var(--color-text-muted)] mt-3 leading-relaxed">
                AI-powered enterprise collaboration for teams that scale.
              </p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{group}</h4>
                <ul className="mt-3 space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href={link === 'Contact' ? '#contact' : link === 'Pricing' ? '#pricing' : '#'}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-150"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between gap-4 text-xs text-[var(--color-text-muted)]">
            <p>&copy; {new Date().getFullYear()} PlanX by Trizen HR. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#contact" className="hover:text-[var(--color-primary)]">
                Privacy
              </a>
              <a href="#contact" className="hover:text-[var(--color-primary)]">
                Terms
              </a>
              <a href="mailto:trizenhr@gmail.com" className="hover:text-[var(--color-primary)]">
                trizenhr@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
