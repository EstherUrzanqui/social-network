import React from "react";
import { Navbar, Nav, NavLink } from 'reactstrap';
import { Link } from "react-router-dom";
import "../css/Navbar.css"

const TheNavbar = props => {
    return (
      <div>
        <Navbar>
          <Nav style={{display:"flex", flexDirection:"row"}}>
            {props.isLoggedIn ? (
              <Nav>
                <NavLink className='link-green' tag={Link} exact to='/dashboard'>
                  Profile
                </NavLink>
                <NavLink
                  className='link-green'
                  tag={Link}
                  exact
                  to='/'
                  onClick={props.logout()}>
                  Logout
                </NavLink>
              </Nav>
            ) : (
              <Nav>
                <NavLink className='link-green' tag={Link} exact to='/signup'>
                  Signup
                </NavLink>
                <NavLink className='link-green' tag={Link} exact to='/login'>
                  Login
                </NavLink>
              </Nav>
            )}
          </Nav>
          <NavLink className='link-green' tag={Link} to='/about'>
            About
          </NavLink>
        </Navbar>
      </div>
    )
  }

export default TheNavbar;