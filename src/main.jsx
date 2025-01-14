import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Examen from './pages/Examen.jsx'
import 'primeicons/primeicons.css';
        
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/examen' element={<Examen/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
