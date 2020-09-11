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
        <div className="genre-name">
          <span className="label">Genre: </span>
          <span className="value">{genre.Name}</span>
        </div>
        <div className="genre-description">
          <span className="label">Description: </span>
          <span className="value">{genre.Name}</span>
        </div>
      </div>
    );
  }
}
//name description
