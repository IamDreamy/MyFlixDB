import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

export class ProfileView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      favoriteMovies: [],
      movies: [],
    };
  }

  componentDidMount() {
    //authentication
    const accessToken = localStorage.getItem("token");
    this.getUser(accessToken);
  }

  getUser(token) {
    const username = localStorage.getItem("user");

    axios
      .get(`https://mjh-myflixapp.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      .then((res) => {
        this.setState({
          Username: res.data.Username,
          Password: res.data.Password,
          Email: res.data.Email,
          Birthday: res.data.Birthday,
          FavoriteMovies: res.data.FavoriteMovies,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  deleteFavoriteMovie(movieId) {
    console.log(this.props.movies);
    axios
      .delete(
        `https://mjh-myflixapp.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}/Movies/${movieId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        alert("Removed movie from favorites");
      })
      .catch((e) => {
        alert("error removing movie" + e);
      });
  }

  deleteUser(e) {
    axios
      .delete(
        `https://mjh-myflixapp.herokuapp.com/users/${localStorage.getItem(
          "user"
        )}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        alert("Account deleted");
        localStorage.removeItem("token", "user");
        window.open("/");
      })
      .catch((event) => {
        alert("failed to delete user");
      });
  }

  render() {
    const { movies } = this.props;
    const favoriteMovieList = movies.filter((movie) =>
      this.state.favoriteMovies.includes(movie._id)
    );
    return (
      <div>
        <Container>
          <br />
          <br />
          <h1>My Profile</h1>
          <br />
          <Card>
            <Card.Body>
              <Card.Text>Username: {this.state.Username}</Card.Text>
              <Card.Text>Password: xxxxxx</Card.Text>
              <Card.Text>Email: {this.state.Email}</Card.Text>
              <Card.Text>Birthday {this.state.Birthday}</Card.Text>
              Favorite Movies:
              {favoriteMovieList.map((movie) => (
                <div key={movie._id} className="fav-movies-button">
                  <Link to={`/movies/${movie._id}`}>
                    <Button variant="link">{movie.Title}</Button>
                  </Link>
                  <Button
                    variant="dark"
                    onClick={(e) => this.deleteFavoriteMovie(movie._id)}
                  >
                    Remove Favorite
                  </Button>
                </div>
              ))}
              <br />
              <br />
              <Link to={"/users/update"}>
                <Button variant="dark">Update Profile</Button>
                <br />
                <br />
              </Link>
              <Button variant="dark" onClick={() => this.deleteUser()}>
                Delete User
              </Button>
              <br />
              <br />
              <Link to={`/`}>
                <Button variant="dark">Back</Button>
              </Link>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}
