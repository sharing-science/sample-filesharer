import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import http from "../http-common";

// core components
import Web3 from "web3";

let web3 = false;

const LoginPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState("");

  const handleLoggedIn = (auth) => {
    localStorage.setItem("public_key", auth);
    let key = getPublicKey();
    setLoggedIn(true);
    setPublicKey(key);
  };

  const handleAuthenticate = ({ publicAddress, signature }) =>
    http.post(
      `http://localhost:5000/api/auth`,
      {
        publicAddress,
        signature,
      }
    ).then((response) => response.data);

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    console.log("handleSign");
    try {
      const signature = await web3.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
        ""
      );

      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };

  const handleClick = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }

    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        return;
      }
    }
    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    // setLoading(true);

    // Look if user with current publicAddress is already present on backend
    http.get(`http://localhost:5000/api/users?publicAddress=${publicAddress}`)
      .then((response) => response.data)
      .then((users) => users[0])
      // Popup MetaMask confirmation modal to sign message
      .then(handleSignMessage)
      // Send signature to backend on the /auth route
      .then(handleAuthenticate)
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(handleLoggedIn)
      .catch((err) => {
        window.alert(err);
      });
  };

  useEffect(() => {
    document.body.classList.toggle("register-page");
    let key = getPublicKey();
    if (key) {
      setLoggedIn(true);
      setPublicKey(key);
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("register-page");
    };
  }, []);

  const getPublicKey = () => {
    let key = localStorage.getItem("public_key");
    return key ? jwtDecode(key).sub.publicAddress : "";
  };

  const logoutUser = () => {
    http.get("http://localhost:5000/logout").then(
      () => {
        localStorage.clear();
        setLoggedIn(false);
      }
    );
  };

  return (
    <div className="page-header">
      <div className="content">
        {!loggedIn ? (
          <button
            className="btn-round"
            color="primary"
            size="lg"
            onClick={handleClick}
          >
            Login With MetaMask
          </button>
        ) : (
          <>
            <p>Your public Key is {publicKey}</p>
            <button
              className="btn-round"
              color="primary"
              size="lg"
              onClick={logoutUser}
            >
              Logout
            </button>
          </>
        )}
        <div className="register-bg" />
      </div>
    </div>
  );
};

export default LoginPage;
