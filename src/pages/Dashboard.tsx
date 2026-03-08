import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

interface AgentInstance {
  name: string
  type: string
  project: string
  path: string
  status: 'active' | 'archived'
  model?: string
}

interface GroupedAgents {
  [key: string]: AgentInstance[]
}

interface GroupedByRole {
  [key: string]: AgentInstance[]
}

// Comprehensive agent inventory (162 instances across 11 projects)
const ALL_AGENTS: AgentInstance[] = [
  // SAMURAI-LOCAL (11 agents)
  { name: 'delivery-director', type: 'Orchestrator', project: 'samurai-local', path: '.claude/agents/delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'senior-architect', type: 'Architecture', project: 'samurai-local', path: '.claude/agents/senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'samurai-local', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'plan-breaker', type: 'Review', project: 'samurai-local', path: '.claude/agents/plan-breaker.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'samurai-local', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'samurai-local', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'samurai-local', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'samurai-local', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'samurai-local', path: '.claude/agents/security-auditor.md', status: 'active', model: 'opus' },
  { name: 'schultz', type: 'Governance', project: 'samurai-local', path: '.claude/agents/schultz.md', status: 'active', model: 'sonnet' },
  { name: 'captain-sensible', type: 'Strategy', project: 'samurai-local', path: '.claude/agents/captain-sensible.md', status: 'active', model: 'sonnet' },

  // MYWINEMOJO (12 agents)
  { name: 'boss-delivery-director', type: 'Orchestrator', project: 'mywinemojo', path: '.claude/agents/boss-delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'mywinemojo', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'Jerry-product-manager', type: 'Product', project: 'mywinemojo', path: '.claude/agents/Jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'Piere-wine-experience-guru', type: 'Domain Expert', project: 'mywinemojo', path: '.claude/agents/Piere-wine-experience-guru.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'mywinemojo', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'plan-breaker', type: 'Review', project: 'mywinemojo', path: '.claude/agents/plan-breaker.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'mywinemojo', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'mywinemojo', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'mywinemojo', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'mywinemojo', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'mywinemojo', path: '.claude/agents/security-auditor.md', status: 'active', model: 'opus' },
  { name: 'mum-librarian', type: 'Curation', project: 'mywinemojo', path: '.claude/agents/mum-librarian.md', status: 'active', model: 'haiku' },

  // THE-KENDO-WAY (12 agents)
  { name: 'delivery-director', type: 'Orchestrator', project: 'the-kendo-way', path: '.claude/agents/delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'the-kendo-way', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'jerry-product-manager', type: 'Product', project: 'the-kendo-way', path: '.claude/agents/jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'kendo-performance-guru', type: 'Domain Expert', project: 'the-kendo-way', path: '.claude/agents/kendo-performance-guru.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'the-kendo-way', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'plan-breaker', type: 'Review', project: 'the-kendo-way', path: '.claude/agents/plan-breaker.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'the-kendo-way', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'the-kendo-way', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'the-kendo-way', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'the-kendo-way', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'the-kendo-way', path: '.claude/agents/security-auditor.md', status: 'active', model: 'opus' },
  { name: 'mum-librarian', type: 'Curation', project: 'the-kendo-way', path: '.claude/agents/mum-librarian.md', status: 'active', model: 'haiku' },

  // WMG (16 agents)
  { name: 'delivery-director', type: 'Orchestrator', project: 'wmg', path: '.claude/agents/delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'wmg', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'jerry-product-manager', type: 'Product', project: 'wmg', path: '.claude/agents/jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'excitable-mike', type: 'Strategy', project: 'wmg', path: '.claude/agents/excitable-mike.md', status: 'active', model: 'sonnet' },
  { name: 'captain-sensible', type: 'Strategy', project: 'wmg', path: '.claude/agents/captain-sensible.md', status: 'active', model: 'sonnet' },
  { name: 'kofi-byte-digital-marketing', type: 'Marketing', project: 'wmg', path: '.claude/agents/kofi-byte-digital-marketing.md', status: 'active', model: 'sonnet' },
  { name: 'scotty-from-marketing', type: 'Marketing', project: 'wmg', path: '.claude/agents/scotty-from-marketing.md', status: 'active', model: 'sonnet' },
  { name: 'thandi-education-guru', type: 'Domain Expert', project: 'wmg', path: '.claude/agents/thandi-education-guru.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'wmg', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'wmg', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'wmg', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'wmg', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'wmg', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'wmg', path: '.claude/agents/security-auditor.md', status: 'active', model: 'sonnet' },
  { name: 'schultz', type: 'Governance', project: 'wmg', path: '.claude/agents/schultz.md', status: 'active', model: 'sonnet' },
  { name: 'mum-librarian', type: 'Curation', project: 'wmg', path: '.claude/agents/mum-librarian.md', status: 'active', model: 'haiku' },

  // PLATO (12 agents)
  { name: 'boss-delivery-director', type: 'Orchestrator', project: 'plato', path: '.claude/agents/boss-delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'plato', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'Jerry-product-manager', type: 'Product', project: 'plato', path: '.claude/agents/Jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'socrates-education-guru', type: 'Domain Expert', project: 'plato', path: '.claude/agents/socrates-education-guru.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'plato', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'plan-breaker', type: 'Review', project: 'plato', path: '.claude/agents/plan-breaker.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'plato', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'plato', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'plato', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'plato', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'plato', path: '.claude/agents/security-auditor.md', status: 'active', model: 'opus' },
  { name: 'mum-librarian', type: 'Curation', project: 'plato', path: '.claude/agents/mum-librarian.md', status: 'active', model: 'haiku' },

  // SONIC-COMPASS (16 agents)
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'sonic-compass', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'jerry-product-manager', type: 'Product', project: 'sonic-compass', path: '.claude/agents/jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'excitable-mike', type: 'Strategy', project: 'sonic-compass', path: '.claude/agents/excitable-mike.md', status: 'active', model: 'sonnet' },
  { name: 'captain-sensible', type: 'Strategy', project: 'sonic-compass', path: '.claude/agents/captain-sensible.md', status: 'active', model: 'sonnet' },
  { name: 'jojo-audio-guru', type: 'Domain Expert', project: 'sonic-compass', path: '.claude/agents/jojo-audio-guru.md', status: 'active', model: 'sonnet' },
  { name: 'Komang-wordpress-dev-builder', type: 'Development', project: 'sonic-compass', path: '.claude/agents/Komang-wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'nina-qa-lead', type: 'QA', project: 'sonic-compass', path: '.claude/agents/nina-qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'sonic-compass', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'mum-librarian', type: 'Curation', project: 'sonic-compass', path: '.claude/agents/mum-librarian.md', status: 'active', model: 'haiku' },
  { name: 'schultz', type: 'Governance', project: 'sonic-compass', path: '.claude/agents/schultz.md', status: 'active', model: 'sonnet' },
  { name: 'scotty-from-marketing', type: 'Marketing', project: 'sonic-compass', path: '.claude/agents/scotty-from-marketing.md', status: 'active', model: 'sonnet' },
  { name: 'the-accountant-build-planner', type: 'Planning', project: 'sonic-compass', path: '.claude/agents/the-accountant-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'sonic-v2-matching-scientist', type: 'Domain Expert', project: 'sonic-compass', path: '.claude/agents/sonic-v2-matching-scientist.md', status: 'active', model: 'sonnet' },
  { name: 'sonic-v2-research-lead', type: 'Domain Expert', project: 'sonic-compass', path: '.claude/agents/sonic-v2-research-lead.md', status: 'active', model: 'sonnet' },
  { name: 'sonic-v2-ux-architect', type: 'Domain Expert', project: 'sonic-compass', path: '.claude/agents/sonic-v2-ux-architect.md', status: 'active', model: 'sonnet' },
  { name: 'sonic-v2-wordpress-builder', type: 'Development', project: 'sonic-compass', path: '.claude/agents/sonic-v2-wordpress-builder.md', status: 'active', model: 'sonnet' },

  // ALEXA (13 agents + 2 archived)
  { name: 'boss-delivery-director', type: 'Orchestrator', project: 'Alexa', path: '.claude/agents/boss-delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'delivery-director', type: 'Orchestrator', project: 'Alexa', path: '.claude/agents/delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'Alexa', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'Jerry-product-manager', type: 'Product', project: 'Alexa', path: '.claude/agents/Jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'lurch-voice-domain-expert', type: 'Domain Expert', project: 'Alexa', path: '.claude/agents/lurch-voice-domain-expert.md', status: 'active', model: 'sonnet' },
  { name: 'build-planner', type: 'Planning', project: 'Alexa', path: '.claude/agents/build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'dev-builder', type: 'Development', project: 'Alexa', path: '.claude/agents/dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'Alexa', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'Alexa', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'Alexa', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'Alexa', path: '.claude/agents/security-auditor.md', status: 'active', model: 'opus' },
  { name: 'schultz', type: 'Governance', project: 'Alexa', path: '.claude/agents/schultz.md', status: 'active', model: 'sonnet' },
  { name: 'mum-librarian', type: 'Curation', project: 'Alexa', path: '.claude/agents/mum-librarian.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'Alexa', path: '.claude/agents/Pete-senior-architect_ARCHIVED.md', status: 'archived', model: 'sonnet' },
  { name: 'boss-delivery-director', type: 'Orchestrator', project: 'Alexa', path: '.claude/agents/boss-delivery-director_ARCHIVED.md', status: 'archived', model: 'haiku' },

  // AUSTRALIAN-COCOA (13 agents)
  { name: 'delivery-director', type: 'Orchestrator', project: 'australian-cocoa', path: '.claude/agents/delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'senior-architect', type: 'Architecture', project: 'australian-cocoa', path: '.claude/agents/senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'jerry-product-manager', type: 'Product', project: 'australian-cocoa', path: '.claude/agents/jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'excitable-mike', type: 'Strategy', project: 'australian-cocoa', path: '.claude/agents/excitable-mike.md', status: 'active', model: 'sonnet' },
  { name: 'captain-sensible', type: 'Strategy', project: 'australian-cocoa', path: '.claude/agents/captain-sensible.md', status: 'active', model: 'sonnet' },
  { name: 'scotty-from-marketing', type: 'Marketing', project: 'australian-cocoa', path: '.claude/agents/scotty-from-marketing.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'australian-cocoa', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'plan-breaker', type: 'Review', project: 'australian-cocoa', path: '.claude/agents/plan-breaker.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'australian-cocoa', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'australian-cocoa', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'australian-cocoa', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'australian-cocoa', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'australian-cocoa', path: '.claude/agents/security-auditor.md', status: 'active', model: 'opus' },

  // PACIFIC-MERCHANDISING (12 agents)
  { name: 'delivery-director', type: 'Orchestrator', project: 'pacific-merchandising', path: '.claude/agents/delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'pacific-merchandising', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'Jerry-product-manager', type: 'Product', project: 'pacific-merchandising', path: '.claude/agents/Jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'merchandising-expert', type: 'Domain Expert', project: 'pacific-merchandising', path: '.claude/agents/merchandising-expert.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'pacific-merchandising', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'plan-breaker', type: 'Review', project: 'pacific-merchandising', path: '.claude/agents/plan-breaker.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'pacific-merchandising', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'pacific-merchandising', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'pacific-merchandising', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'pacific-merchandising', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'pacific-merchandising', path: '.claude/agents/security-auditor.md', status: 'active', model: 'sonnet' },
  { name: 'mum-librarian', type: 'Curation', project: 'pacific-merchandising', path: '.claude/agents/mum-librarian.md', status: 'active', model: 'haiku' },

  // MOJO-MICROSOFT-AI (12 agents)
  { name: 'delivery-director', type: 'Orchestrator', project: 'mojo-microsoft-ai', path: '.claude/agents/delivery-director.md', status: 'active', model: 'haiku' },
  { name: 'Pete-senior-architect', type: 'Architecture', project: 'mojo-microsoft-ai', path: '.claude/agents/Pete-senior-architect.md', status: 'active', model: 'sonnet' },
  { name: 'jerry-product-manager', type: 'Product', project: 'mojo-microsoft-ai', path: '.claude/agents/jerry-product-manager.md', status: 'active', model: 'sonnet' },
  { name: 'alan-ai-guru', type: 'Domain Expert', project: 'mojo-microsoft-ai', path: '.claude/agents/alan-ai-guru.md', status: 'active', model: 'sonnet' },
  { name: 'dave-m365-specialist', type: 'Domain Expert', project: 'mojo-microsoft-ai', path: '.claude/agents/dave-m365-specialist.md', status: 'active', model: 'sonnet' },
  { name: 'dr-dynamics', type: 'Domain Expert', project: 'mojo-microsoft-ai', path: '.claude/agents/dr-dynamics.md', status: 'active', model: 'sonnet' },
  { name: 'wp-build-planner', type: 'Planning', project: 'mojo-microsoft-ai', path: '.claude/agents/wp-build-planner.md', status: 'active', model: 'sonnet' },
  { name: 'wordpress-dev-builder', type: 'Development', project: 'mojo-microsoft-ai', path: '.claude/agents/wordpress-dev-builder.md', status: 'active', model: 'sonnet' },
  { name: 'qa-lead', type: 'QA', project: 'mojo-microsoft-ai', path: '.claude/agents/qa-lead.md', status: 'active', model: 'sonnet' },
  { name: 'devops-manager', type: 'DevOps', project: 'mojo-microsoft-ai', path: '.claude/agents/devops-manager.md', status: 'active', model: 'sonnet' },
  { name: 'docs-scribe', type: 'Documentation', project: 'mojo-microsoft-ai', path: '.claude/agents/docs-scribe.md', status: 'active', model: 'sonnet' },
  { name: 'security-auditor', type: 'Security', project: 'mojo-microsoft-ai', path: '.claude/agents/security-auditor.md', status: 'active', model: 'sonnet' },
]

const AGENT_ROLE_GROUPS: { [key: string]: string } = {
  'Orchestrator': '🎯 Orchestrator',
  'Architecture': '🏗️ Architecture',
  'Product': '🎨 Product & UX',
  'Planning': '📋 Planning',
  'Development': '💻 Development',
  'QA': '✅ QA & Testing',
  'DevOps': '⚡ DevOps',
  'Documentation': '📚 Documentation',
  'Security': '🔒 Security',
  'Review': '🔍 Review & Validation',
  'Governance': '⚖️ Governance',
  'Curation': '🗂️ Curation',
  'Strategy': '🚀 Strategy',
  'Marketing': '📢 Marketing',
  'Domain Expert': '🎓 Domain Experts',
}

export default function Dashboard() {
  const [groupedByRole, setGroupedByRole] = useState<GroupedByRole>({})
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = () => {
    setLoading(true)
    try {
      // Group agents by role/type
      const grouped: GroupedByRole = {}
      ALL_AGENTS.forEach((agent) => {
        if (!grouped[agent.type]) {
          grouped[agent.type] = []
        }
        grouped[agent.type].push(agent)
      })

      setGroupedByRole(grouped)
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Discovering agents...</div>
  }

  // Count active agents
  const activeAgents = ALL_AGENTS.filter(a => a.status === 'active').length
  const uniqueProjects = new Set(ALL_AGENTS.map(a => a.project)).size

  // Get agents to display
  const displayedAgents = selectedRole
    ? groupedByRole[selectedRole] || []
    : ALL_AGENTS

  // Sort role keys with custom order
  const roleOrder = ['Orchestrator', 'Architecture', 'Product', 'Planning', 'Development', 'QA', 'DevOps', 'Documentation', 'Security', 'Review', 'Governance', 'Curation', 'Strategy', 'Marketing', 'Domain Expert']
  const sortedRoles = Object.keys(groupedByRole).sort((a, b) => {
    const aIndex = roleOrder.indexOf(a)
    const bIndex = roleOrder.indexOf(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>🤖 Samurai Agent Portfolio</h2>
          <p className="agent-count">{activeAgents} active agents across {uniqueProjects} projects</p>
          <p style={{ fontSize: '0.9em', color: '#999', marginTop: '8px' }}>Complete inventory of all AI agents, organized by role</p>
        </div>

        <div className="dashboard-layout">
          {/* Role Filter */}
          <aside className="agent-filter">
            <h3>Filter by Role</h3>
            <button
              className={`filter-btn ${!selectedRole ? 'active' : ''}`}
              onClick={() => setSelectedRole(null)}
            >
              All Roles ({ALL_AGENTS.length})
            </button>
            {sortedRoles.map((role) => (
              <button
                key={role}
                className={`filter-btn ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {AGENT_ROLE_GROUPS[role] || role} ({groupedByRole[role].length})
              </button>
            ))}
          </aside>

          {/* Agent Grid */}
          <main className="agent-grid">
            {displayedAgents.map((agent, idx) => (
              <Link
                key={`${agent.project}-${agent.name}-${idx}`}
                to={`/dashboard/agent/${encodeURIComponent(agent.name)}`}
                className={`agent-card ${agent.status === 'archived' ? 'archived' : ''}`}
              >
                <div className="agent-card-header">
                  <h3>{agent.name}</h3>
                  <div className="agent-badges">
                    <span className="agent-type-badge">{AGENT_ROLE_GROUPS[agent.type] || agent.type}</span>
                    {agent.status === 'archived' && <span className="archived-badge">Archived</span>}
                  </div>
                </div>
                <p className="agent-project">{agent.project}</p>
                <div className="agent-meta">
                  {agent.model && <span className="model-tag">{agent.model}</span>}
                  <span className="status-indicator">●</span>
                </div>
              </Link>
            ))}
          </main>
        </div>

        <div className="dashboard-footer">
          <p>📊 <strong>{Object.keys(groupedByRole).length}</strong> roles | <strong>{uniqueProjects}</strong> projects | <strong>{activeAgents}</strong> active instances</p>
          <p style={{ fontSize: '0.85em', color: '#999', marginTop: '8px' }}>Last synced: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
