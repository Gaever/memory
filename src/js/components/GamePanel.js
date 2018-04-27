import React, { Component } from "react";
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {execRuntimeActions} from '@components/Game';
import {GameStates} from '@actions';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

export default class GamePanel extends Component{

	stopLabel="Стоп";
	startLabel="Старт";

	constructor(props){
		super(props);
		this.state={
			startBtnLabel: 'Старт',
			startBtnOnClick: this.props.start,

			pauseBtnLabel: 'Пауза',
			pauseBtnOnClick: this.props.pause,
			pauseBtnDisabled: true
		}
	}

	componentDidUpdate(prevProps){
		var actions = {
			[GameStates.READY]: [() => {
				this.setState({
					startBtnLabel: this.startLabel,
					startBtnOnClick: this.props.start,
					pauseBtnDisabled: true,
				})
			}],
			[GameStates.RUNNING]: [() => {
				this.setState({
					startBtnLabel: this.stopLabel,
					startBtnOnClick: this.props.finish,
					pauseBtnDisabled: false,
				})
			}],
			[GameStates.PAUSED]: [() => {
				this.setState({
					startBtnLabel: this.stopLabel,
					startBtnOnClick: this.props.finish,
					pauseBtnDisabled: false,
				})
			}],
			[GameStates.FINISHED]: [() => {
				this.setState({
					startBtnLabel: this.startLabel,
					startBtnOnClick: this.props.start,
					pauseBtnDisabled: true,
				})
			}],
		};

		execRuntimeActions(this.props.gameState, prevProps.gameState, actions);
	}


	formatSecondsAsTime(secs, format) {
		var hr  = Math.floor(secs / 3600);
		var min = Math.floor((secs - (hr * 3600))/60);
		var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

		if (hr < 10) { hr = "0" + hr; }
		if (min < 10) { min = "0" + min; }
		if (sec < 10) { sec = "0" + sec; }
		if (hr) { hr = "00"; }

		if (format != null) {
			var formatted_time = format.replace('hh', hr);
			formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
			formatted_time = formatted_time.replace('mm', min);
			formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
			formatted_time = formatted_time.replace('ss', sec);
			formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
			return formatted_time;
		} else {
			return hr + ':' + min + ':' + sec;
		}
	}

	getTimerPanel(){
		return this.props.time
			? <ToolbarTitle text={this.formatSecondsAsTime(this.props.time, "mm:ss")} />
			: null
	}

	getInfoPanel(){
		return this.props.givenCondition
			? <ToolbarTitle text={this.props.givenCondition}/>
			: null;
	}

	getScorePanel(){
		return (
			(this.props.gameState !== GameStates.READY) 
			&& (this.props.score || this.props.score === 0)
		)
			? <ToolbarTitle text={`Очки: ${this.props.score}`}/>
			: null;
	}


	render(){
		return (
			<Toolbar>
				<ToolbarGroup firstChild={true}>
					<RaisedButton
						label={this.state.startBtnLabel}
						primary={true}
						onClick={this.state.startBtnOnClick}
					/>
					<RaisedButton
						label={this.state.pauseBtnLabel}
						disabled={this.state.pauseBtnDisabled}
						onClick={this.state.pauseBtnOnClick}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					{this.getInfoPanel()}
					{this.getTimerPanel()}
					{this.getScorePanel()}
				</ToolbarGroup>
			</Toolbar>
		)
	}
}

GamePanel.propsTypes = {
	time: PropTypes.number,
	givenCondition: PropTypes.any,
	score: PropTypes.number,
	gameState: PropTypes.string.isRequired,

	start: PropTypes.func.isRequired,
	finish: PropTypes.func.isRequired,
	pause: PropTypes.func.isRequired
}
