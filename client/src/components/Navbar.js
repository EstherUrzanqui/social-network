import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { Navbar, Nav, NavLink } from "reactstrap";


const TheNavbar = (props) => {
    return (
        <div className="navbar">
            <Navbar>
                <Nav>
                    <NavLink tag={Link} exact to="/">Home</NavLink> <NavLink tag={Link} exact to="/login">Login</NavLink> <NavLink tag={Link} exact to="/signin">Signin</NavLink>
                </Nav>
            </Navbar>
        </div>
    )
}

export default TheNavbar;