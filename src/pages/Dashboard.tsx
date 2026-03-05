import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

interface AgentInstance {
  name: string
  type: string
  project: string
  path: string
  lastUpdated?: string
}

interface GroupedAgents {
  [key: string]: AgentInstance[]
}

const AGENT_PROJECTS = [
  { name: 'samurai-local', path: 'c/Users/teamm/Local Sites/samurai-local' },
  { name: 'mywinemojo', path: 'c/Users/teamm/Local Sites/mywinemojo' },
  { name: 'the-kendo-way', path: 'c/Users/teamm/Local Sites/the-kendo-way' },
  { name: 'wmg', path: 'c/Users/teamm/Local Sites/wmg' },
]

const AGENT_TYPES = [
  'delivery-director',
  'senior-architect',
  'wp-build-planner',
  'plan-breaker',
  'wordpress-dev-builder',
  'qa-lead',
  'devops-manager',
  'docs-scribe',
  'security-auditor',
  'product-manager',
]

export default function Dashboard() {
  const [agents, setAgents] = useState<AgentInstance[]>([])
  const [groupedAgents, setGroupedAgents] = useState<GroupedAgents>({})
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    setLoading(true)
    try {
      // Simulate loading agents from projects
      // In production, this would fetch from GitHub API or local file system
      const loadedAgents: AgentInstance[] = [
        // Samurai Framework Agents
        { name: 'delivery-director', type: 'Orchestrator', project: 'samurai-local', path: '.claude/agents/delivery-director.md' },
        { name: 'senior-architect (Pete)', type: 'Architecture', project: 'samurai-local', path: '.claude/agents/senior-architect.md' },
        { name: 'wp-build-planner', type: 'Planning', project: 'samurai-local', path: '.claude/agents/wp-build-planner.md' },
        { name: 'plan-breaker', type: 'Review', project: 'samurai-local', path: '.claude/agents/plan-breaker.md' },
        { name: 'wordpress-dev-builder', type: 'Development', project: 'samurai-local', path: '.claude/agents/wordpress-dev-builder.md' },
        { name: 'qa-lead', type: 'QA', project: 'samurai-local', path: '.claude/agents/qa-lead.md' },
        { name: 'devops-manager', type: 'DevOps', project: 'samurai-local', path: '.claude/agents/devops-manager.md' },
        { name: 'docs-scribe', type: 'Documentation', project: 'samurai-local', path: '.claude/agents/docs-scribe.md' },

        // MyWineMojo Agents
        { name: 'delivery-director', type: 'Orchestrator', project: 'mywinemojo', path: '.claude/agents/delivery-director.md' },
        { name: 'product-manager (Jerry)', type: 'Product', project: 'mywinemojo', path: '.claude/agents/product-manager.md' },
        { name: 'senior-architect (Pete)', type: 'Architecture', project: 'mywinemojo', path: '.claude/agents/senior-architect.md' },
        { name: 'security-auditor', type: 'Security', project: 'mywinemojo', path: '.claude/agents/security-auditor.md' },
        { name: 'wp-build-planner', type: 'Planning', project: 'mywinemojo', path: '.claude/agents/wp-build-planner.md' },

        // The Kendo Way Agents
        { name: 'delivery-director', type: 'Orchestrator', project: 'the-kendo-way', path: '.claude/agents/delivery-director.md' },
        { name: 'senior-architect', type: 'Architecture', project: 'the-kendo-way', path: '.claude/agents/senior-architect.md' },
        { name: 'devops-manager', type: 'DevOps', project: 'the-kendo-way', path: '.claude/agents/devops-manager.md' },

        // Alexa Agents
        { name: 'delivery-director', type: 'Orchestrator', project: 'Alexa', path: '.claude/agents/delivery-director.md' },
        { name: 'senior-architect', type: 'Architecture', project: 'Alexa', path: '.claude/agents/senior-architect.md' },

        // WMG Agents
        { name: 'delivery-director', type: 'Orchestrator', project: 'wmg', path: '.claude/agents/delivery-director.md' },
      ]

      setAgents(loadedAgents)

      // Group by agent type
      const grouped: GroupedAgents = {}
      loadedAgents.forEach((agent) => {
        if (!grouped[agent.type]) {
          grouped[agent.type] = []
        }
        grouped[agent.type].push(agent)
      })

      setGroupedAgents(grouped)
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Discovering agents...</div>
  }

  const displayedAgents = selectedType
    ? groupedAgents[selectedType] || []
    : agents

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Agent Portfolio</h2>
          <p className="agent-count">{agents.length} agents across {AGENT_PROJECTS.length} projects</p>
        </div>

        <div className="dashboard-layout">
          {/* Agent Type Filter */}
          <aside className="agent-filter">
            <h3>Agent Types</h3>
            <button
              className={`filter-btn ${!selectedType ? 'active' : ''}`}
              onClick={() => setSelectedType(null)}
            >
              All Agents ({agents.length})
            </button>
            {Object.keys(groupedAgents)
              .sort()
              .map((type) => (
                <button
                  key={type}
                  className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type} ({groupedAgents[type].length})
                </button>
              ))}
          </aside>

          {/* Agent Grid */}
          <main className="agent-grid">
            {displayedAgents.map((agent, idx) => (
              <Link
                key={`${agent.project}-${agent.name}-${idx}`}
                to={`/dashboard/agent/${encodeURIComponent(agent.name)}`}
                className="agent-card"
              >
                <div className="agent-card-header">
                  <h3>{agent.name}</h3>
                  <span className="agent-type-badge">{agent.type}</span>
                </div>
                <p className="agent-project">{agent.project}</p>
                <div className="agent-meta">
                  <span className="meta-label">Path:</span>
                  <code>{agent.path}</code>
                </div>
              </Link>
            ))}
          </main>
        </div>

        <div className="dashboard-footer">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p style={{ fontSize: '0.85em' }}>Auto-refresh every 30 seconds</p>
        </div>
      </div>
    </div>
  )
}
