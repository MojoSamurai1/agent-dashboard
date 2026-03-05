import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './AgentDetail.css'

interface AgentInfo {
  name: string
  instances: Array<{
    project: string
    path: string
    status: 'active' | 'archived' | 'retired'
    lastUpdated?: string
  }>
  description: string
  role: string
  skills: string[]
  memories?: string[]
  context?: string
}

const AGENT_REGISTRY: { [key: string]: AgentInfo } = {
  'delivery-director': {
    name: 'Delivery Director',
    instances: [
      { project: 'samurai-local', path: '.claude/agents/delivery-director.md', status: 'active' },
      { project: 'mywinemojo', path: '.claude/agents/delivery-director.md', status: 'active' },
      { project: 'the-kendo-way', path: '.claude/agents/delivery-director.md', status: 'active' },
      { project: 'Alexa', path: '.claude/agents/delivery-director.md', status: 'active' },
      { project: 'wmg', path: '.claude/agents/delivery-director.md', status: 'active' },
    ],
    description: 'Orchestrates all work across the project. Routes tasks to specialist agents and enforces proper sequence.',
    role: 'Orchestrator / Project Router',
    skills: ['Task routing', 'Workflow orchestration', 'Agent delegation', 'Dependency management', 'Progress tracking'],
    memories: [
      'Agent roster and capabilities',
      'Current project phase and milestones',
      'Active feature branches',
      'Deployment status',
      'Critical blockers and dependencies',
    ],
    context: 'Runs as the primary agent orchestrator for all projects. Acts as the gateway for all work requests.',
  },
  'senior-architect': {
    name: 'Senior Architect (Pete)',
    instances: [
      { project: 'samurai-local', path: '.claude/agents/senior-architect.md', status: 'active' },
      { project: 'mywinemojo', path: '.claude/agents/senior-architect.md', status: 'active' },
      { project: 'the-kendo-way', path: '.claude/agents/senior-architect.md', status: 'active' },
      { project: 'Alexa', path: '.claude/agents/senior-architect.md', status: 'active' },
    ],
    description: 'Performs high-level architectural review. Evaluates system design, identifies bottlenecks and scalability concerns.',
    role: 'Architecture Reviewer / System Designer',
    skills: ['System design', 'Architecture audit', 'Refactoring strategy', 'Performance analysis', 'Scalability planning'],
    memories: [
      'Project architecture patterns',
      'Technology stack decisions',
      'Known performance bottlenecks',
      'Scalability constraints',
      'System design precedents',
    ],
    context: 'Invoked for architecture decisions, major refactors, and system performance optimization.',
  },
  'product-manager': {
    name: 'Product Manager (Jerry)',
    instances: [
      { project: 'mywinemojo', path: '.claude/agents/product-manager.md', status: 'active' },
    ],
    description: 'Analyzes client requirements, designs user journeys, and translates business needs into UX specifications.',
    role: 'Product Strategy / UX Design',
    skills: ['Requirement gathering', 'User journey mapping', 'UX specification', 'Wireframing', 'Stakeholder management'],
    memories: [
      'User personas and behavior patterns',
      'Feature roadmap and priorities',
      'Client feedback and requests',
      'UX patterns and best practices',
      'Market research insights',
    ],
    context: 'Invoked during discovery, requirement gathering, and feature design phases.',
  },
  'wp-build-planner': {
    name: 'WordPress Build Planner',
    instances: [
      { project: 'samurai-local', path: '.claude/agents/wp-build-planner.md', status: 'active' },
      { project: 'mywinemojo', path: '.claude/agents/wp-build-planner.md', status: 'active' },
    ],
    description: 'Creates detailed software build plans for WordPress/PHP development. Produces structured implementation roadmaps.',
    role: 'Build Planning / Implementation Strategy',
    skills: ['Build planning', 'Architecture planning', 'WordPress patterns', 'Risk assessment', 'Traceability'],
    memories: [
      'WordPress architecture patterns',
      'Plugin integration precedents',
      'Database schema standards',
      'Deployment procedures',
      'Testing frameworks and patterns',
    ],
    context: 'Invoked to create detailed implementation plans before development starts.',
  },
  'wordpress-dev-builder': {
    name: 'WordPress Developer',
    instances: [
      { project: 'samurai-local', path: '.claude/agents/wordpress-dev-builder.md', status: 'active' },
      { project: 'mywinemojo', path: '.claude/agents/wordpress-dev-builder.md', status: 'active' },
    ],
    description: 'Implements WordPress features following build plans. Writes PHP, JavaScript, and creates custom post types.',
    role: 'WordPress Development / Code Implementation',
    skills: ['PHP development', 'WordPress API', 'ACF integration', 'REST API design', 'Custom post types'],
    memories: [
      'WordPress best practices',
      'Current codebase structure',
      'Plugin dependencies',
      'Deployment environment setup',
      'Security and escaping standards',
    ],
    context: 'Invoked for WordPress-specific feature implementation.',
  },
  'qa-lead': {
    name: 'QA Lead',
    instances: [
      { project: 'samurai-local', path: '.claude/agents/qa-lead.md', status: 'active' },
    ],
    description: 'Creates test scripts, QA checklists, and verification procedures. Ensures implementations meet build plans.',
    role: 'Quality Assurance / Testing',
    skills: ['Test planning', 'QA scripts', 'Acceptance criteria', 'Regression testing', 'Verification procedures'],
    memories: [
      'Test coverage standards',
      'Known edge cases and bugs',
      'Regression test suite',
      'Acceptance criteria templates',
      'Test environment setup',
    ],
    context: 'Invoked to create test plans and verify implementations.',
  },
  'security-auditor': {
    name: 'Security Auditor',
    instances: [
      { project: 'mywinemojo', path: '.claude/agents/security-auditor.md', status: 'active' },
    ],
    description: 'Performs security reviews and audits. Identifies vulnerabilities and ensures compliance.',
    role: 'Security Review / Vulnerability Assessment',
    skills: ['Security audit', 'Vulnerability assessment', 'Compliance review', 'Authentication design', 'Data protection'],
    memories: [
      'OWASP top 10',
      'Known vulnerabilities in dependencies',
      'Compliance requirements',
      'Security best practices',
      'Encryption and secrets management',
    ],
    context: 'Invoked for security reviews and vulnerability assessments.',
  },
}

export default function AgentDetail() {
  const { agentName } = useParams<{ agentName: string }>()
  const [agent, setAgent] = useState<AgentInfo | null>(null)

  useEffect(() => {
    if (agentName) {
      const decoded = decodeURIComponent(agentName)
      // Try to find agent by name or partial match
      let foundAgent = AGENT_REGISTRY[decoded.toLowerCase()]
      if (!foundAgent) {
        // Try partial match
        const key = Object.keys(AGENT_REGISTRY).find(
          (k) => k.includes(decoded.toLowerCase()) || decoded.toLowerCase().includes(k)
        )
        if (key) foundAgent = AGENT_REGISTRY[key]
      }
      setAgent(foundAgent || null)
    }
  }, [agentName])

  if (!agent) {
    return (
      <div className="agent-detail-error">
        <h2>Agent not found</h2>
        <p>Could not find agent: {agentName}</p>
        <Link to="/dashboard/" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="agent-detail">
      <div className="agent-detail-container">
        <Link to="/dashboard/" className="back-link">
          ← Back to All Agents
        </Link>

        <div className="agent-detail-header">
          <h1>{agent.name}</h1>
          <p className="agent-role">{agent.role}</p>
          <p className="agent-description">{agent.description}</p>
        </div>

        <div className="detail-grid">
          {/* Instances */}
          <section className="detail-section">
            <h2>Instances</h2>
            <div className="instances-list">
              {agent.instances.map((instance, idx) => (
                <div key={idx} className="instance-card">
                  <div className="instance-header">
                    <h3>{instance.project}</h3>
                    <span className={`status-badge status-${instance.status}`}>
                      {instance.status}
                    </span>
                  </div>
                  <code className="instance-path">{instance.path}</code>
                  {instance.lastUpdated && (
                    <p className="instance-updated">Updated: {instance.lastUpdated}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="detail-section">
            <h2>Skills & Capabilities</h2>
            <div className="skills-list">
              {agent.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Context */}
          {agent.context && (
            <section className="detail-section full-width">
              <h2>Agent Context</h2>
              <p className="agent-context">{agent.context}</p>
            </section>
          )}

          {/* Memories */}
          {agent.memories && (
            <section className="detail-section full-width">
              <h2>Memory Areas</h2>
              <ul className="memories-list">
                {agent.memories.map((memory, idx) => (
                  <li key={idx}>{memory}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="agent-footer">
          <p>Last synced: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
