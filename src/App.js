import React from 'react';

import calendar from './assets/img/calendar.png';
import graph from './assets/img/graph.png';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Weather, { Home, Graph } from './Weather';
import { SpinnerCircularFixed } from 'spinners-react';

const credentials = require('./crendential.json');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: '',

			weather_data: [],
			weather: false,

			coord_lat: '',
			coord_lon: '',

			isGraph: true,
		};

		this.getPos = this.getPos.bind(this);
		this.getWeather = this.getWeather.bind(this);
		this.handleTab = this.handleTab.bind(this);
	}
	componentDidMount() {
		this.getPos();
	}

	handleTab() {
		this.setState({
			isGraph: !this.state.isGraph
		});
	}

	getPos() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.getWeather);
		} else {
			this.setState({
				weather: false
			});
		}
	}
	getWeather(position) {
		let lat, lon;

		if (position) {
			this.setState({
				coord_lat: position.coords.latitude,
				coord_lon: position.coords.longitude,
			});
			lat = position.coords.latitude;
			lon = position.coords.longitude;
		} else {
			lat = this.state.coord_lat;
			lon = this.state.coord_lon;
		}

		let url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + credentials.API_weather + '&units=metric&lang=fr';

		const headers = new Headers();
		headers.append('Accept', 'application/json');

		fetch(url, {
			method: 'GET',
			headers: headers,
		})
			.then(res => res.json())
			.then(data => {
				this.setState({
					weather_data: data,
					weather: true
				});
			})
			.catch(err => {
				this.setState({
					weather: false
				});
			});
	}

	render() {
		return (
			<Router>
				<header>
					<div style={{ width: 100 }}>
						<span>Météo</span>
					</div>
					<div style={{ width: 120 }}>

					</div>
				</header>

				{
					this.state.weather
						? <><Weather
							weather={this.state.weather}
							weather_data={this.state.weather_data}
						/>
							<Tabs
								isGraph={this.state.isGraph}
								handleTab={this.handleTab}
							/>
							{
								this.state.isGraph
									? <div className='App' style={{ overflowX: 'scroll', height: '335px' }}>
										<Graph
											weather={this.state.weather}
											weather_data={this.state.weather_data}
										/>
									</div>
									: <div className='App'>
									<Home
										weather={this.state.weather}
										weather_data={this.state.weather_data}
									/>
								</div>
							}
						</>
						: <div className="start">
							<h1>Météo</h1>
							<div className="container">
								<i className="loader --4"></i>
							</div>
						</div>
				}


			</Router>
		);
	}
}

function Tabs({ isGraph, handleTab }) {
	return (
		<div className="tabs App">
			<div className={`tab blue classic_fluent_btn ${isGraph && 'selected'}`} onClick={handleTab}>
				<img src={graph} className='det_img' alt="graph" />
				Graphique
			</div>
			<div className={`tab blue classic_fluent_btn ${!isGraph && 'selected'}`} onClick={handleTab}>
				<img src={calendar} className='det_img' alt="calendar" />
				Prévisions
			</div>
		</div>
	);
}


export default App;