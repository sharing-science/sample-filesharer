import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import http from '../http-common'

import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap'

const NavBar = () => {
  // Hooks
  const [collapseOpen, setCollapseOpen] = useState(false)
  const [collapseOut, setCollapseOut] = useState('')
  const [color, setColor] = useState('navbar-transparent')
  const [loggedIn, setLoggedIn] = useState(false)

  const getPublicKey = () => {
    let key = localStorage.getItem('public_key')
    return key ? jwtDecode(key).sub.publicAddress : ''
  }

  // Change Colors when scrolling down
  useEffect(() => {
    window.addEventListener('scroll', changeColor)
    let key = getPublicKey()
    if (key) {
      setLoggedIn(true)
    }
    return () => {
      window.removeEventListener('scroll', changeColor)
    }
  }, [])

  const changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setColor('bg-info')
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setColor('navbar-transparent')
    }
  }

  // Collapse NavBar
  const toggleCollapse = () => {
    document.documentElement.classList.toggle('nav-open')
    setCollapseOpen(!collapseOpen)
  }
  const onCollapseExiting = () => {
    setCollapseOut('collapsing-out')
  }
  const onCollapseExited = () => {
    setCollapseOut('')
  }

  // Buttons
  const logInButtonClick = () => {
    http.get('http://localhost:5000/logout').then(() => {
      localStorage.clear()
      setLoggedIn(false)
    })
  }

  return (
    <Navbar className={'fixed-top ' + color} color-on-scroll="100" expand="lg">
      <Container>
        <div className="navbar-translate">
          <NavbarBrand to="/" tag={Link} id="navbar-brand">
            <span>SCIENCE </span>
            With Blockchain
          </NavbarBrand>
          <UncontrolledTooltip placement="bottom" target="navbar-brand">
            Rensselaer Polytechnic Institute
          </UncontrolledTooltip>
          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={'justify-content-end ' + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <span>SCIENCE</span>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://twitter.com/"
                rel="noopener noreferrer"
                target="_blank"
                title="Follow us on Twitter"
              >
                <i className="fab fa-twitter" />
                <p className="d-lg-none d-xl-none">Twitter</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://www.facebook.com/"
                rel="noopener noreferrer"
                target="_blank"
                title="Like us on Facebook"
              >
                <i className="fab fa-facebook-square" />
                <p className="d-lg-none d-xl-none">Facebook</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://github.com/sharing-science/SCIENCE-Website"
                rel="noopener noreferrer"
                target="_blank"
                title="Star us on Github"
              >
                <i className="fab fa-github" />
                <p className="d-lg-none d-xl-none">Github</p>
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav>
              <DropdownToggle
                caret
                color="default"
                data-toggle="dropdown"
                nav
                onClick={(e) => e.preventDefault()}
              >
                <i className="fa fa-cogs d-lg-none d-xl-none" />
                Getting started
              </DropdownToggle>
              <DropdownMenu className="dropdown-with-icons">
                <DropdownItem tag={Link} to="/login">
                  <i className="tim-icons icon-badge" />
                  Login Page
                </DropdownItem>
                <DropdownItem tag={Link} to="/contract">
                  <i className="tim-icons icon-bullet-list-67" />
                  Sample Contract
                </DropdownItem>
                <DropdownItem tag={Link} to="/tokens">
                  <i className="tim-icons icon-coins" />
                  Tokens
                </DropdownItem>
                <DropdownItem tag={Link} to="/landing-page">
                  <i className="tim-icons icon-image-02" />
                  Landing Page
                </DropdownItem>
                <DropdownItem tag={Link} to="/profile">
                  <i className="tim-icons icon-single-02" />
                  Profile Page
                </DropdownItem>
                <DropdownItem tag={Link} to="/upload">
                  <i className="tim-icons icon-cloud-upload-94" />
                  Upload Page
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              {loggedIn ? (
                <Button
                  className="nav-link d-none d-lg-block"
                  color="info"
                  onClick={logInButtonClick}
                >
                  <i className="tim-icons icon-spaceship" />
                  LogOut
                </Button>
              ) : (
                <Button
                  className="nav-link d-none d-lg-block"
                  color="info"
                  tag={Link}
                  to="/login"
                >
                  <i className="tim-icons icon-spaceship" />
                  Login
                </Button>
              )}
            </NavItem>
            <NavItem>
              <Button
                className="nav-link d-none d-lg-block"
                color="default"
                tag={Link}
                to="/profile"
              >
                <i className="tim-icons icon-single-02" /> Profile
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
