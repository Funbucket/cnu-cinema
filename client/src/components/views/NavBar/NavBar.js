import React from 'react';
import RightMenu from './Sections/RightMenu';
import './Sections/NavBar.css';


function NavBar() {
  return (
    <div className='nav_container'>
      <nav className='nav_contents'>
          <a href="/">홈</a>
          <RightMenu/>
      </nav>
    </div>
  )
}

export default NavBar