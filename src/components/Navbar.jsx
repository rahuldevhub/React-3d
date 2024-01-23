import React from 'react'
import logo from '../assets/images/logo.svg';
const Navbar = () => {
  return (
    <nav className='nav-wrapper'>

    <div className='nav-content'>
        <ul className='list-styled'>
            <li>
                <img src={logo} alt='logo'></img>
            </li>
            <li>
                <a className='link-styled'>About Us</a>
            </li>
            <li>
                <a className='link-styled'>Service</a>
            </li>
            <li>
                <a className='link-styled'>Testimonial</a>
            </li>
            <li>
                <a className='link-styled'>Contact</a>
            </li>
        </ul>
    </div>

    </nav>
  )
}

export default Navbar