import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { Navbar, Nav, NavLink, NavbarBrand } from "reactstrap";


const TheNavbar = (props) => {
    console.log(props)
    return (
        <div className="navbar">
            <Navbar>
                <NavbarBrand>
                    <NavLink id="logo" tag={Link} to ="/">
                        <img src="/img/logounax.png" alt="image" style={{ width: 150 }} />
                    </NavLink> 
                </NavbarBrand>
                <Nav>
                  {props.isLoggedIn ? (
                    <Nav>
                        <NavLink className="link-pink" tag={Link} to="/profile">
                        Profile
                        </NavLink>
                        <NavLink className="link-pink" tag={Link} to="/feed">
                        Feed
                        </NavLink>
                        <NavLink
                        className="link-pink"
                        tag={Link}
                        to="/"
                        onClick={props.logout()}>
                        Logout
                        </NavLink>
                    </Nav>
                  ) : (
                    <Nav>
                        <NavLink className="link-pink" tag={Link} to="/">
                        Login
                        </NavLink> 
                        <NavLink className="link-pink" tag={Link} to="/signin">
                        Sign up
                        </NavLink>
                    </Nav>
                  )}   
                </Nav>
            </Navbar>
        </div>
    )
}

export default TheNavbar;