import React from 'react'
import logo from "./assets/image/logo512.png"

function Header() {
  return (
    <div className='app-header'>
        <img src={logo} alt='React Logo' />
        <h1>The React Quiz</h1>
    </div>
  )
}

export default Header