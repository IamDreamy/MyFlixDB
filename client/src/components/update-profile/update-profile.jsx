import axios from "axios";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import "./update-profile.scss";

export function UpdateProfile(props) {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [email, updateEmail] = useState("");
  const [birthday, updateDob] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log();
    // send a request to the server for authentication
    axios
      .put(
        `https://mjh-myflixapp.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}`,
        {
          Username: username,
          Password: password,
          Birthday: birthday,
          Email: email,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        const data = res.data;
        console.log(data);
        alert("Profile updated");
        window.open("/");
      })
      .catch((e) => {
        console.log(username);
        alert("error updating user");
      });
  };

  return (
    <Container className="UpdateContainer">
      <br />
      <br />
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => updateUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => updatePassword(e.target.value)}
        />
      </Form.Group>

      <Form className="UpdateForm">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            placeholder="01/01/1985"
            value={birthday}
            onChange={(e) => updateDob(e.target.value)}
          />
        </Form.Group>
        <Button
          className="update-btn"
          variant="dark"
          type="submit"
          onClick={handleUpdate}
        >
          Update profile
        </Button>
        <br />
        <br />
        <Link to={`/user`}>
          <Button className="back-btn" variant="dark">
            Back
          </Button>
        </Link>
      </Form>
    </Container>
  );
}
