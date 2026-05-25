import { useState } from 'react'
import { Mail, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { DEMO_CONTACT } from '@/mock/landing'

interface FormState {
  name: string
  email: string
  company: string
  teamSize: string
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  company: '',
  teamSize: '11-50',
  message: '',
}

export function ContactSection() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <section id="contact" className="py-20 px-6 bg-white border-y border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <p className="text-sm font-medium text-[var(--color-primary)]">Get in touch</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--color-text)] mt-2 tracking-tight">
              Talk with the PlanX team
            </h2>
            <p className="text-[var(--color-text-muted)] mt-4 leading-relaxed max-w-md">
              Whether you need a demo, enterprise pricing, or a pilot for your organization — our team at Trizen
              HR will help you evaluate PlanX for your workflows.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex gap-3 text-sm">
                <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="font-medium text-[var(--color-text)]">Email</p>
                  <a
                    href={`mailto:${DEMO_CONTACT.email}`}
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {DEMO_CONTACT.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="font-medium text-[var(--color-text)]">Phone</p>
                  <p className="text-[var(--color-text-muted)]">{DEMO_CONTACT.phone}</p>
                </div>
              </li>
              <li className="flex gap-3 text-sm">
                <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="font-medium text-[var(--color-text)]">Office</p>
                  <p className="text-[var(--color-text-muted)]">{DEMO_CONTACT.address}</p>
                </div>
              </li>
              <li className="flex gap-3 text-sm">
                <Clock className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="font-medium text-[var(--color-text)]">Hours</p>
                  <p className="text-[var(--color-text-muted)]">{DEMO_CONTACT.hours}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4">
                <CheckCircle2 className="w-12 h-12 text-[var(--color-primary)] mb-4" />
                <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">Request received</h3>
                <p className="text-[var(--color-text-muted)] mt-3 max-w-sm leading-relaxed">
                  Thanks for reaching out. A member of our team will connect with you within{' '}
                  <strong className="text-[var(--color-text)]">1–2 business days</strong> to schedule a demo or
                  answer your questions.
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-4">
                  Reference: {form.email || 'your submission'}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-6"
                  onClick={() => {
                    setSubmitted(false)
                    setForm(initialForm)
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-[var(--color-text)]">Request a demo</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full name" value={form.name} onChange={update('name')} required placeholder="Alex Morgan" />
                  <Input
                    label="Work email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    required
                    placeholder="you@company.com"
                  />
                </div>
                <Input
                  label="Company"
                  value={form.company}
                  onChange={update('company')}
                  required
                  placeholder="Trizen Ventures"
                />
                <div>
                  <label htmlFor="team-size" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Team size
                  </label>
                  <select
                    id="team-size"
                    value={form.teamSize}
                    onChange={update('teamSize')}
                    className="w-full px-2 py-1.5 border border-[var(--color-border)] rounded-[var(--radius-control)] text-sm bg-white focus-ring"
                  >
                    <option value="1-10">1–10</option>
                    <option value="11-50">11–50</option>
                    <option value="51-200">51–200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
                <Textarea
                  label="How can we help?"
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about your workflows, timeline, and goals."
                  rows={4}
                />
                <Button type="submit" className="w-full sm:w-auto px-6">
                  Submit request
                </Button>
                <p className="text-xs text-[var(--color-text-muted)]">
                  By submitting, you agree to be contacted about PlanX. Demo data is stored locally for this preview.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
