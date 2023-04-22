import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./register.scss";

function Register() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDeptCodeChange = (event) => {
    setDeptCode(event.target.value);
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    if (password.length < 6 || password.length > 20) {
      setErrorMessage("Password should be more than 6 long.");
      return;
    }
    if (name.length < 3 || name.length > 30) {
      setErrorMessage("Name should be more than 3 characters long.");
      return;
    }
    try {
      const response = await fetch("http://gs1ksa.org:3001/api/tblUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          password: password,
          name: name,
          deptcode: deptCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Do something with the response data
        console.log(data);
        window.location.href = "/";
      } else {
        // if registration failed, show error message for 5 seconds
        setErrorMessage("Registration failed. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Container className="container justify-content-center p-3">
        <h1 className="form pb-2 text1">Registration</h1>
        {/* Form */}
        <Form className="form" onSubmit={handleRegistration}>
          {/* User ID */}
          <Form.Group controlId="formUserId" className="form pb-3">
            <Form.Label className="form">User ID*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user ID"
              value={userId}
              onChange={handleUserIdChange}
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
          {/* Name */}
          <Form.Group controlId="formName" className="form pb-3">
            <Form.Label className="form">Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={handleNameChange}
              style={{ width: "90%" }}
              required
            />
          </Form.Group>
          {/* Department Code */}
          <Form.Group controlId="formDeptCode" className="form pb-3">
            <Form.Label className="form">Department Code*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department code"
              value={deptCode}
              onChange={handleDeptCodeChange}
              style={{ width: "90%" }}
              required
            />
          </Form.Group>
          {/* Buttons */}
          <Form.Group className="form pb-3">
<Button className="button" type="submit">
Register
</Button>
<Link to="/">
            <Button>Back to Login</Button>
          </Link>
</Form.Group>
{/* Error message */}
{errorMessage && (
<div className="text-danger">{errorMessage}</div>
)}
</Form>
</Container>
</div>
);
}

export default Register;