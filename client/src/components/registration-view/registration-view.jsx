import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./registration-view.scss";

export function RegistrationView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://chrisflix.herokuapp.com/users", {
        Username: username,
        Password: password,
        Email: email,
        Bday: birthday,
      })
      .then((response) => {
        const data = response.data;
        alert("Your account has been created! Please login");
        console.log(data);
        window.open("/client", "_self");
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  };

  return (
    <Form className="registration-form">
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Birth Date:</Form.Label>
        <Form.Control
          type="string"
          value={birthday}
          placeholder="01/01/2001"
          onChange={(e) => setBirthday(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="btn-lg btn-dark btn-block"
        type="submit"
        onClick={handleSubmit}
      >
        Register
      </Button>
    </Form>
  );
}
