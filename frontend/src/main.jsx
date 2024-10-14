import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Expense from './components/Expense.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route index element={<Login/>} />
        <Route path='home' element={<App/>} />
        <Route path='signup' element={<Signup/>}/>
        <Route path='expense' element={<Expense/>} />
      </Routes>
    </BrowserRouter>
  </>
)
