import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import http from '../http-common'
import { Link } from 'react-router-dom'

import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardImg,
  CardTitle,
  Container,
  Row,
  Col,
} from 'reactstrap'

// core components
import Web3 from 'web3'

let web3 = false

const LoginPage = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [publicKey, setPublicKey] = useState('')

  const handleLoggedIn = (auth) => {
    localStorage.setItem('public_key', auth)
    let key = getPublicKey()
    setLoggedIn(true)
    setPublicKey(key)
  }

  const handleAuthenticate = ({ publicAddress, signature }) =>
    http
      .post(`http://localhost:5000/api/auth`, {
        publicAddress,
        signature,
      })
      .then((response) => response.data)

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    console.log('handleSign')
    try {
      const signature = await web3.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
        '',
      )

      return { publicAddress, signature }
    } catch (err) {
      throw new Error('You need to sign the message to be able to log in.')
    }
  }

  const handleLogin = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert('Please install MetaMask first.')
      return
    }

    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable()

        // We don't know window.web3 version, so we use our own instance of web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum)
      } catch (error) {
        window.alert('You need to allow MetaMask.')
        return
      }
    }
    const coinbase = await web3.eth.getCoinbase()
    if (!coinbase) {
      window.alert('Please activate MetaMask first.')
      return
    }

    const publicAddress = coinbase.toLowerCase()
    // setLoading(true);

    // Look if user with current publicAddress is already present on backend
    http
      .get(`http://localhost:5000/api/users?publicAddress=${publicAddress}`)
      .then((response) => response.data)
      .then((users) => users[0])
      // Popup MetaMask confirmation modal to sign message
      .then(handleSignMessage)
      // Send signature to backend on the /auth route
      .then(handleAuthenticate)
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(handleLoggedIn)
      .catch((err) => {
        window.alert(err)
      })
  }

  useEffect(() => {
    document.body.classList.toggle('register-page')
    let key = getPublicKey()
    if (key) {
      setLoggedIn(true)
      setPublicKey(key)
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle('register-page')
    }
  }, [])

  const getPublicKey = () => {
    let key = localStorage.getItem('public_key')
    return key ? jwtDecode(key).sub.publicAddress : ''
  }

  const handleLogout = () => {
    http.get('http://localhost:5000/logout').then(() => {
      localStorage.clear()
      setLoggedIn(false)
    })
  }

  return (
    <>
      <div className="wrapper register-page">
        <div className="page-header">
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <Card className="card-register">
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require('assets/img/square6.png').default}
                      />
                      <CardTitle tag="h4">
                        <span className="ml-3">Login</span>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter>
                      {!loggedIn ? (
                        <Button
                          className="btn-round"
                          color="info"
                          size="lg"
                          onClick={handleLogin}
                        >
                          Login With MetaMask
                        </Button>
                      ) : (
                        <>
                          <h5>Your Public Key is: {publicKey}</h5>
                          <Button
                            className="btn-round"
                            color="info"
                            size="lg"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </>
                      )}
                      <Button
                        className="btn-round"
                        color="info"
                        size="lg"
                        tag={Link}
                        to="/"
                      >
                        File Storage
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
