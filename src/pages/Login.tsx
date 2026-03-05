import React, { useState } from 'react'
import './Login.css'

interface LoginProps {
  onLogin: (password: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(password)
    setPassword('')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🤖 Agent Dashboard</h1>
          <p>Samurai Framework - Live Agent Monitoring System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value="michael@samurai.rocks"
              disabled
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                autoComplete="off"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-info">
          <p>Access restricted to authorized personnel only.</p>
          <p style={{ fontSize: '0.85em', color: '#999', marginTop: '10px' }}>
            Portal ID: 2f6d9c1a-4e2b-11ec-81d3-0242ac130003
          </p>
        </div>
      </div>
    </div>
  )
}
