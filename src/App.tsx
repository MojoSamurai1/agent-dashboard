import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AgentDetail from './pages/AgentDetail'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has valid token
    const token = localStorage.getItem('authToken')
    if (token && token === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (password: string) => {
    // Simple password validation (michael@samurai.rocks / ChangeMe213!!!)
    if (password === 'ChangeMe213!!!') {
      localStorage.setItem('authToken', 'authenticated')
      localStorage.setItem('user', 'michael@samurai.rocks')
      setIsAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <header className="app-header">
            <div className="header-content">
              <h1>🤖 Agent Dashboard</h1>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agent/:agentName" element={<AgentDetail />} />
          </Routes>
        </>
      )}
    </div>
  )
}

export default App
