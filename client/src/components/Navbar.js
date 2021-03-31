import React, { useState } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavLink, NavbarBrand, NavItem } from "reactstrap";
import "../css/Navbar.css"

const TheNavbar = (props) => {
    const [collapsed, setCollapsed] = useState(true)

    const toggleNavbar = () => setCollapsed(!collapsed)

    return (
        <div>
            <Navbar color="faded" light>
                <NavbarBrand href="/" className="mr-auto" id="logo">Unax</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav>
                        {props.isLoggedIn ? (
                        <Nav navbar className="ml-auto">
                            <NavItem>
                                <NavLink href="/profile">Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/feed">Feed</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/edit">Account</NavLink>
                            </NavItem>
                            <NavItem>
                            <NavLink href="/" onClick={props.logout()}>Logout</NavLink>
                            </NavItem>   
                        </Nav>
                        ) : (
                        <Nav navbar className="ml-auto" >
                            <NavItem>
                                <NavLink className="link-pink" href="/">Login</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="link-pink" href="/signin">Sign up</NavLink>
                            </NavItem>   
                        </Nav>
                        )}   
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}

export default TheNavbar;