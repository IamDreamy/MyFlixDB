import React from "react";
import { connect } from "react-redux";

import { Container, Col, Row } from "react-bootstrap";
import VisibilityFilterInput from "../visibility-filter-input/visibility-filter-input";
import { MovieCard } from "../movie-card/movie-card";

const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== "") {
    filteredMovies = movies.filter((m) =>
      m.Title.toLocaleLowerCase().includes(visibilityFilter.toLocaleLowerCase())
    );
  }

  if (!movies) return <div className="main-view" />;

  return (
    <div className="movies-list">
      <VisibilityFilterInput visibilityFilter={visibilityFilter} />
      <Container fluid>
        <Row>
          {filteredMovies.map((movie) => (
            <Col key={movie._id}>
              <MovieCard key={movie._id} movie={movie} />
            </Col>
          ))}
        </Row>
        å
      </Container>
    </div>
  );
}

export default connect(mapStateToProps, null)(MoviesList);
