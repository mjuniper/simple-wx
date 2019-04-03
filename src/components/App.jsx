import React, { Component } from 'react';
import Navbar from './Navbar.jsx';
import Day from './Day.jsx';
import ReactDOM from 'react-dom';

// TODO: get position vs location straight...
// maybe it is location = { name, position }

// TODO: refactor this into a module
const WX_API = 'https://api.weather.gov';

async function fetchDailyWx(position) {
  const wxPoint = await fetchWxPoint(position);
  return await fetchWxForecast(wxPoint);
}

function fetchWxPoint(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  let url = `${WX_API}/points/${lat},${lon}`;
  return fetch(url)
    .then(response => response.json())
    .catch(err => {
      console.error(`Error fetching ${err}`);
      throw err;
    });
}

function fetchWxForecast(wxPoint) {
  return fetch(wxPoint.properties.forecast)
    .then(response => response.json())
    .catch(err => {
      console.error(`Error fetching ${err}`);
      throw err;
    });
}

// ===========

export class App extends Component {
  constructor(props) {
    super(props);
    // TODO: get stuff out of localstorage
    // and of course put it in localstorage
    // there might be a package that does that for me (keeps state in sync)
    this.state = {
      loading: true,
      locations: [],
      currentLocation: null,
      currentDay: null,
      lastLocation: null,
      dailyWx: null
    };

    // this.getLocation = this.getLocation.bind(this);
  }

  // setFilter(filter) {
  //   const newState = cloneObject(this.status);
  //   newState.filter = filter;
  //   this.setState(newState);
  // }

  // showOpenTrails (e) {
  //   e.preventDefault();
  //   this.setFilter({status: 'open'});
  // }

  componentWillMount() {
    // TODO: should it use current location or last location???
    this.getLocation();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const curLoc = this.state.currentLocation;
    // const curDay = this.state.currentDay;
    if (curLoc !== prevState.currentLocation) {
      // if the location changed, we need to fetch the Daily weather
      this.fetchDailyWx(curLoc);
      // } else if (curDay !== prevState.currentDay) {
      //   // if the selected day changed, we need to fetch the hourly weather
      //   this.fetchHourlyWx(curLoc, curDay);
    }
  }

  getLocation() {
    this.setState({ loading: true });
    window.navigator.geolocation.getCurrentPosition(
      this.handleGeolocationSuccess.bind(this),
      this.handleGeolocationError.bind(this)
    );
  }

  handleGeolocationSuccess(position) {
    this.setState({ currentLocation: position });
  }

  handleGeolocationError() {
    // TODO: get rid of if...
    if (this.state.lastLocation) {
      this.setState({ currentLocation: this.state.lastLocation });
    } else {
      // TODO: handle this case
    }
  }

  async fetchDailyWx(loc) {
    this.setState({ loading: true });
    const dailyWx = await fetchDailyWx(loc);
    // debugger;
    this.setState({
      loading: false,
      dailyWx
    });
    console.log(dailyWx);
    // return fetchDailyWx(loc)
    //   .then(data => {
    //     this.setState({ trailData: data, loading: false });
    //   })
    //   .catch(err => {
    //     this.setState({ error: err, loading: false });
    //   });
  }

  // fetchHourlyWx(loc, day) {
  //   this.setState({ loading: true });
  //   return fetchHourlyWx(loc, day)
  //     .then(data => {
  //       this.setState({ trailData: data, loading: false });
  //     })
  //     .catch(err => {
  //       this.setState({ error: err, loading: false });
  //     });
  // }

  render() {
    // const {
    //   setFilter,
    //   showOpenTrails,
    //   showClosedTrails,
    //   showAllTrails} = this;

    // TODO: make this more resilient
    // we probably want to transform at least some of the data
    // also we are dotting into this.state.dailyWx.properties.periods.length!!!

    const dailyWx =
      this.state.dailyWx &&
      this.state.dailyWx.properties &&
      this.state.dailyWx.properties.periods;

    return (
      <div className="wrap">
        <Navbar />
        <main role="main" className="container-fluid">
          <section className="daily-wx">
            <h1>Daily Weather</h1>
            <ol>
              {!dailyWx || dailyWx.length === 0 ? (
                <li>No Wx?</li>
              ) : (
                dailyWx.map((day, idx) => <Day key={idx} {...day} />)
              )}
            </ol>
          </section>
        </main>
      </div>
    );
  }
}

export default App;

const wrapper = document.getElementById('root');
wrapper ? ReactDOM.render(<App />, wrapper) : false;
