import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

export class Day extends Component {
  render() {
    return (
      <li className="wx-day">
        <h2>{this.props.name}</h2>
        <div>Forecast: {this.props.shortForecast}</div>
        <img src={this.props.icon} alt="" />
        <div>Temp: {this.props.temperature} {this.props.temperatureUnit}</div>
        <div>Wind: {this.props.windSpeed} {this.props.windDirection}</div>
      </li>
    );
  }
}

export default Day;
