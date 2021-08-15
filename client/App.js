import React from 'react'

import Navbar from './components/Navbar'
import Routes from './Routes'
import { ToastContainer, toast } from 'react-toastify';

toast.configure()

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
