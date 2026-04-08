import React from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router'
import Home from './routes/Home.jsx'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to={'/home'} />} />
      <Route path='/home' element={<Home />} />
    </Routes>
  )
}

export default App