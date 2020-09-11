import React from "react";

export class DirectorView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { director } = this.props;
    if (!director) return null;

    return (
      <div className="director-view">
        <div className="director-name">
          <span className="label">Name: </span>
          <span className="value">{director.Name}</span>
        </div>
        <div className="director-bio">
          <span className="label">Bio: </span>
          <span className="value">{director.Bio}</span>
        </div>
        <div className="director-bday">
          <span className="label">BirthDay: </span>
          <span className="value">{director.Bday}</span>
        </div>
      </div>
    );
  }
}
