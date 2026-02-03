import React from 'react'
import './App.css'
import { useMousePosition, useScrollReveal } from './hooks'
import { useTheme } from './ThemeContext'

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const ContactLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href.startsWith('http') ? href : href.startsWith('mailto:') || href.startsWith('tel:') ? href : `https://${href}`}
    target={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : '_blank'}
    rel={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all duration-300 group hover-lift hover-glow active:scale-95"
  >
    {icon}
    <span>{label}</span>
  </a>
)

const RevealSection = ({ id, title, children, className = '' }: { id?: string; title: string; children: React.ReactNode; className?: string }) => {
  const { ref, revealed } = useScrollReveal(0.08)
  return (
    <section id={id} ref={ref} className={`mb-20 ${revealed ? 'revealed' : ''} reveal ${className}`}>
      <h2 className="text-xl font-semibold font-display text-cyan-400/95 mb-8 flex items-center gap-3 tracking-tight">
        <span className="w-1 h-7 bg-linear-to-b from-cyan-400 to-teal-500 rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  )
}

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    className={`w-5 h-5 text-cyan-400/80 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const TypingEffect = ({ text, speed = 50, delay = 500 }: { text: string; speed?: number; delay?: number }) => {
  const [displayed, setDisplayed] = React.useState('')
  const [done, setDone] = React.useState(false)
  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null
    const startTimer = setTimeout(() => {
      let i = 0
      intervalId = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          if (intervalId) clearInterval(intervalId)
        }
      }, speed)
    }, delay)
    return () => {
      clearTimeout(startTimer)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, speed, delay])
  return (
    <span>
      {displayed}
      {!done && <span className="typing-cursor inline-block ml-0.5">|</span>}
    </span>
  )
}

const HighlightText = ({ text, terms }: { text: string; terms: string[] }) => {
  if (terms.length === 0) return <>{text}</>
  const sorted = [...terms].sort((a, b) => b.length - a.length)
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        terms.some((t) => part.toLowerCase() === t.toLowerCase()) ? (
          <span key={i} className="exp-highlight px-0.5 rounded">{part}</span>
        ) : (
          part
        )
      )}
    </>
  )
}

const EXPERIENCE_DATA = [
  {
    title: "Front-End Developer",
    company: "Deel",
    companyUrl: "https://www.deel.com",
    companyLogo: "https://www.google.com/s2/favicons?domain=deel.com&sz=128",
    period: "Aug 2023 - Present",
    bullets: [
      { text: "Working as a Frontend Developer skilled in JavaScript, TypeScript, ReactJS, SQL, and modern UI frameworks such as Material UI and Tailwind CSS, contributing to a rapidly scaling product startup.", highlights: ["JavaScript", "TypeScript", "ReactJS", "Material UI", "Tailwind CSS"] },
      { text: "Contributed as a frontend engineer in designing and developing the Payroll and Leave Management modules, supporting frontend architecture and feature delivery.", highlights: ["Payroll", "Leave Management", "frontend architecture"] },
      { text: "One of the founding engineers of the Astute Payroll Project, building centralized authentication and user/employee management modules from scratch, supporting role-based access and secure workflows.", highlights: ["founding engineers", "Astute Payroll Project", "role-based access"] },
      { text: "Experienced in leveraging utility libraries like Lodash, RXJS, Zustand, React Query, Day.js, clsx, and i18next to create dynamic, reusable, and maintainable components with optimized performance.", highlights: ["Lodash", "RXJS", "Zustand", "React Query", "optimized performance"] },
      { text: "Integrated backend services using OpenAPI-generated clients, ensuring type-safe API calls and keeping frontend and backend in sync.", highlights: ["OpenAPI", "type-safe API"] },
      { text: "Executed end-to-end automated tests with WebdriverIO and Cucumber, ensuring reliable releases and reduced regression issues.", highlights: ["WebdriverIO", "Cucumber", "end-to-end automated tests"] },
    ],
  },
  {
    title: "Associate Front-End Developer",
    company: "Rakuten",
    companyUrl: "https://global.rakuten.com/corp/",
    companyLogo: "https://www.google.com/s2/favicons?domain=rakuten.com&sz=128",
    period: "Jun 2022 - Aug 2023",
    bullets: [
      { text: "Develop visually appealing and user-friendly web applications using HTML, CSS, JavaScript, React.js and Next.js with TypeScript and Tailwind.", highlights: ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "TypeScript", "Tailwind"] },
      { text: "Create and maintain component libraries with Storybook setup, providing deep customization for multiple projects.", highlights: ["component libraries", "Storybook"] },
      { text: "Manage SendGrid email templates for efficient communication with users.", highlights: ["SendGrid"] },
      { text: "Work in coordination with the QA team to perform functional and system testing, ensuring high-quality, bug-free applications.", highlights: ["QA team", "functional and system testing"] },
    ],
  },
]

const ExperienceAccordion = () => {
  const [expandedIndices, setExpandedIndices] = React.useState<Set<number>>(new Set([0, 1]))
  const toggle = (i: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }
  return (
    <div className="space-y-6">
      {EXPERIENCE_DATA.map((job, i) => (
        <ExperienceCard
          key={job.company}
          {...job}
          expanded={expandedIndices.has(i)}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  )
}

const ExperienceCard = ({
  title,
  company,
  companyUrl,
  companyLogo,
  period,
  bullets,
  expanded,
  onToggle,
}: {
  title: string
  company: string
  companyUrl?: string
  companyLogo?: string
  period: string
  bullets: { text: string; highlights?: string[] }[]
  expanded: boolean
  onToggle: () => void
}) => (
  <div
    onClick={onToggle}
    className={`group relative rounded-2xl bg-white/2 border border-white/5 hover:border-cyan-500/20 transition-all duration-500 hover:bg-white/4 hover-glow cursor-pointer overflow-hidden ${
        expanded ? 'ring-1 ring-cyan-500/20' : ''
      }`}
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-5 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white font-display tracking-tight">{title}</h3>
            <span className="text-slate-500">–</span>
            <span className="text-xs font-medium text-cyan-400/90 uppercase tracking-wider">{period}</span>
          </div>
          {companyUrl ? (
            <a
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 mt-0.5 group/link"
            >
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt=""
                  className="w-5 h-5 rounded object-contain bg-white/10"
                />
              )}
              <span className="text-cyan-400/90 text-sm font-medium group-hover/link:text-cyan-300 transition-colors">
                {company}
              </span>
            </a>
          ) : (
            <p className="text-slate-400 text-sm font-medium mt-0.5">{company}</p>
          )}
        </div>
        <div className="shrink-0">
          <ChevronIcon expanded={expanded} />
        </div>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
            <div className="px-5 pb-5 pt-0 border-t border-white/5 mt-0">
            <ul className="space-y-3 pt-4">
              {bullets.map((bullet, i) => (
                <li key={i} className="bullet-accent text-slate-300 text-[15px] leading-[1.7]">
                  <HighlightText text={bullet.text} terms={bullet.highlights || []} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
)

type ProjectCardProps = {
  name: string
  tech: string
  overview: string
  features: string[]
  contributions: string[]
  label?: string
}

const ProjectCard = ({ name, tech, overview, features, contributions, label }: ProjectCardProps) => (
  <div className="relative p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-teal-500/20 transition-all duration-500 hover-lift hover-glow cursor-default group/card">
    {label && (
      <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
        {label}
      </span>
    )}
    <h3 className="text-base font-semibold text-white font-display mb-2 group-hover/card:text-cyan-300 transition-colors tracking-tight">{name}</h3>
    <p className="text-cyan-400/90 text-xs font-medium mb-4 uppercase tracking-wider">{tech}</p>
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Overview</h4>
        <p className="text-slate-400 text-[15px] leading-[1.7]">{overview}</p>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Key Features</h4>
        <ul className="space-y-1.5">
          {features.map((f, i) => (
            <li key={i} className="bullet-accent text-slate-400 text-[14px] leading-[1.6]">{f}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">My Contributions</h4>
        <ul className="space-y-1.5">
          {contributions.map((c, i) => (
            <li key={i} className="bullet-accent text-slate-400 text-[14px] leading-[1.6]">{c}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

const SKILLS = {
  Languages: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "Java", "SQL"],
  "Libraries & Frameworks": ["ReactJS", "Next.js", "React Query", "Zustand", "RXJS", "i18next", "Day.js", "Lodash", "Loadable"],
  Testing: ["Jest", "React Testing Library", "WebdriverIO", "Cucumber"],
  "Tools & Practices": ["Vite", "Webpack", "PNPM", "OpenAPI", "SEO", "Performance Optimization"],
  "UI & Styling": ["Material UI", "Tailwind CSS", "Clsx"],
}

const SkillTag = ({ label }: { label: string }) => (
  <span className="inline-block px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all duration-300 cursor-default">
    {label}
  </span>
)

const SkillsSidebar = () => (
  <aside className="lg:sticky lg:top-24 lg:self-start">
    <div className="skills-bubble-container skills-focus-ring rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm min-w-[300px] relative overflow-hidden">
      <h3 className="skills-title-focus text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">Skills</h3>
      <div className="max-h-[min(80vh,560px)] overflow-y-auto overflow-x-hidden space-y-5 pr-1 skills-scroll">
        {Object.entries(SKILLS).map(([category, skills]) => (
          <div key={category}>
            <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2.5">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <SkillTag key={s} label={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </aside>
)

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border hover:border-cyan-500/50 transition-all duration-300 shrink-0 ${
        theme === 'dark' ? 'border-slate-500/30 text-slate-400 hover:text-cyan-400' : 'border-slate-300 text-slate-600 hover:text-cyan-600'
      }`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      <span className="text-xs font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

const NAV_ITEMS = [
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Hobbies', id: 'hobbies' },
]

const Header = () => {
  const [scrolled, setScrolled] = React.useState(false)
  const { theme } = useTheme()
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const headerBg = theme === 'dark'
    ? (scrolled ? 'bg-[#0a0f1a]/90' : 'bg-transparent')
    : (scrolled ? 'bg-slate-100/95' : 'bg-transparent')

  return (
    <header
      className={`sticky top-0 z-40 w-full overflow-hidden transition-all duration-500 backdrop-blur-xl border-b ${
        theme === 'dark' ? 'border-white/10' : 'border-slate-200'
      } ${scrolled ? (theme === 'dark' ? 'shadow-[0_4px_30px_rgba(34,211,238,0.08)]' : 'shadow-lg shadow-slate-200/50') : ''} ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="group flex items-center shrink-0"
          >
            <span className="text-xl font-bold font-display tracking-tight whitespace-nowrap">
              <span className={`${theme === 'dark' ? 'text-white group-hover:text-cyan-400' : 'text-slate-800 group-hover:text-cyan-600'} transition-colors duration-300`}>Saroj</span>
              <span className="text-cyan-400 group-hover:text-teal-400 transition-colors duration-300"> Kumar</span>
            </span>
            <span className={`text-sm font-medium hidden lg:inline border-l pl-3 ml-2 ${
              theme === 'dark' ? 'text-slate-500 border-white/10' : 'text-slate-600 border-slate-300'
            }`}>
              Frontend Developer
            </span>
          </a>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

function App() {
  const { x, y, isVisible } = useMousePosition()
  const { theme } = useTheme()

  return (
    <div
      data-theme={theme}
      className={`min-h-screen font-body antialiased transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#0a0f1a] text-slate-200'
          : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Cursor-follow glow */}
      <div
        className={`fixed pointer-events-none z-50 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] transition-opacity duration-300 ${
          theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10'
        }`}
        style={{
          left: x,
          top: y,
          opacity: isVisible ? (theme === 'dark' ? 0.6 : 0.3) : 0,
        }}
      />
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float-slow animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-float animation-delay-300" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_380px] lg:gap-14">
          <main className="min-w-0 flex flex-col gap-0">
        {/* Hero */}
        <header className="mb-20 animate-fade-in-up order-1">
          <h1 className="text-5xl md:text-6xl font-bold font-display text-white mb-4 tracking-tight">
            Saroj <span className="bg-linear-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">Kumar</span>
          </h1>
          <p className="hero-description text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed min-h-8">
            <TypingEffect text="Frontend Developer · 3.5+ years building scalable, responsive web applications" speed={40} delay={600} />
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="animate-fade-in-up animation-delay-100 inline-block"><ContactLink href="mailto:skun799@gmail.com" icon={<span className="text-lg">✉️</span>} label="skun799@gmail.com" /></span>
            <span className="animate-fade-in-up animation-delay-200 inline-block"><ContactLink href="tel:7992268950" icon={<span className="text-lg">📱</span>} label="7992268950" /></span>
            <span className="animate-fade-in-up animation-delay-300 inline-block"><ContactLink href="https://linkedin.com/in/saroj799/" icon={<LinkedInIcon />} label="LinkedIn" /></span>
            <span className="animate-fade-in-up animation-delay-400 inline-block"><ContactLink href="https://github.com/sarojkumar1234" icon={<GitHubIcon />} label="GitHub" /></span>
          </div>
        </header>

        {/* Summary */}
        <RevealSection id="summary" title="Summary" className="order-2">
          <p className="text-slate-300 text-base leading-[1.75] max-w-2xl">
            <HighlightText
              text="Dynamic Frontend Developer with 3.5+ years of experience in building scalable, responsive, and user-friendly web applications. Proficient in JavaScript, ReactJS, TypeScript, Material UI, and Tailwind CSS, with a proven record of delivering end-to-end solutions, collaborating with cross-functional teams, and driving project success."
              terms={["Dynamic Frontend Developer", "3.5+ years", "scalable, responsive, and user-friendly", "JavaScript", "ReactJS", "TypeScript", "Material UI", "Tailwind CSS", "end-to-end solutions", "cross-functional teams"]}
            />
          </p>
        </RevealSection>

        {/* Skills - after summary on mobile, sidebar on desktop */}
        <div className="order-3 mb-8 lg:hidden w-full [&_.skills-bubble-container]:min-w-0" id="skills">
          <SkillsSidebar />
        </div>

        {/* Experience */}
        <RevealSection id="experience" title="Experience" className="order-4">
          <ExperienceAccordion />
        </RevealSection>

        {/* Projects */}
        <RevealSection id="projects" title="Projects" className="order-5">
          <div className="grid sm:grid-cols-2 gap-6">
            <ProjectCard
              name="Rakuten Sports Digital Academy"
              label="Worked with Andres Iniesta and his team"
              tech="React, TypeScript, Tailwind, Next.js"
              overview="Online sports learning platform (Iniesta Academy) led by Andres Iniesta, offering football skills training across web, Android and iOS."
              features={[
                "Multi-platform availability (Web, Android, iOS)",
                "Payment gateway integration",
                "Skylark CMS, SendGrid, THEO Player integration",
              ]}
              contributions={[
                "Built React component library with Storybook",
                "Developed responsive, reusable UI components",
                "TypeScript-based architecture",
              ]}
            />
            <ProjectCard
              name="Priority Vaccination Scheduler"
              label="Best Project in University"
              tech="HTML, CSS, JavaScript"
              overview="Full-stack web application that generates a priority-based vaccination schedule for COVID-19."
              features={[
                "Priority algorithm based on health index, age & profession",
                "User parameter inputs (comorbidities, occupation)",
                "Automated schedule generation",
              ]}
              contributions={[
                "Developed self-curated priority algorithms",
                "Implemented frontend and backend logic",
                "End-to-end application development",
              ]}
            />
          </div>
        </RevealSection>

        {/* Education */}
        <RevealSection title="Education" className="order-6">
          <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-cyan-500/20 transition-all duration-500 hover-lift hover-glow cursor-default">
            <h3 className="text-lg font-semibold text-white font-display tracking-tight">B.Tech, Computer Science and Engineering</h3>
            <p className="text-cyan-400/90 text-sm font-medium mt-1">University of Petroleum and Energy Studies</p>
            <p className="text-slate-400 text-sm mt-2">Jun 2018 - Jun 2022 · GPA: 8.1</p>
          </div>
        </RevealSection>

        {/* Hobbies */}
        <RevealSection id="hobbies" title="Hobbies" className="order-7">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/2 border border-white/5 hover:border-cyan-500/20 transition-all duration-300 hover-lift">
              <span className="text-2xl">🏏</span>
              <span className="text-slate-300 font-medium">Cricket</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/2 border border-white/5 hover:border-cyan-500/20 transition-all duration-300 hover-lift">
              <span className="text-2xl">📚</span>
              <span className="text-slate-300 font-medium">Reading</span>
            </div>
          </div>
        </RevealSection>

        <footer className="mt-28 pt-10 border-t border-white/10 text-center order-8">
          <p className="text-slate-500 text-sm font-medium">Built with React + Vite + Tailwind</p>
          <p className="text-slate-600 text-xs mt-1">© {new Date().getFullYear()} Saroj Kumar</p>
        </footer>
          </main>

          {/* Skills sidebar - desktop only */}
          <div className="hidden lg:block" id="skills-desktop">
            <SkillsSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
