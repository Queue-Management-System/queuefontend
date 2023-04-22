import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./login.scss";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault(); // prevent default form submission behavior
    try {
      const response = await fetch("http://gs1ksa.org:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // if login successful, redirect to home page
        console.log(data)
        window.location.href = "/home";
      } else {
        // if login failed, show error message for 5 seconds
        setErrorMessage("Invalid username or password. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Container className="container justify-content-center p-3">
        <h1 className="text-center1 form pb-2">Login Information</h1>
        {/* Form */}
        <Form className="form" onSubmit={handleLogin}>
          <Form.Group controlId="formUsername" className="form pb-3">
            {/* Username */}
            <Form.Label className="form">Username*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
              style={{ width: "90%" }}
              required
            />
          </Form.Group>
          {/* Password */}
          <Form.Group controlId="formPassword" className="form pb-3">
            <Form.Label className="form">Password*</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
              style={{ width: "90%" }}
              required
            />
          </Form.Group>
          {/* Buttons */}
          <Button className="lbtn" type="submit">
            Login
          </Button>
          <Link to="/register">
            <Button className="lbtn">Sign Up</Button>
          </Link>
        </Form>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </Container>
    </div>
  );
}

export default Login;
