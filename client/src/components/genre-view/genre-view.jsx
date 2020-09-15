import React from "react";

export class GenreView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { genre } = this.props;
    if (!genre) return null;

    return (
      <div className="genre-view">
        <br />
        <br />
        <div className="genre-name">
          <span className="label">Genre: </span>
          <span className="value">{genre.Name}</span>
        </div>
        <div className="genre-description">
          <br />
          <br />
          <span className="label">Description: </span>
          <span className="value">{genre.Description}</span>
        </div>
      </div>
    );
  }
}
//name description
