import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GamePanel from '@containers/GamePanelContainer';
import RaisedButton from 'material-ui/RaisedButton';
import { GameStates } from '@actions';
import { timerBase, tick } from '@/config';
import Dialog from 'material-ui/Dialog';

export function execRuntimeActions(gameState, prevGameState, actions){

	if(gameState == prevGameState){return;}

	const exec = function(funcs){
		if(!funcs){return;}
		funcs.map(function(func){func()});
	}

	switch(gameState){
		case GameStates.READY:
			exec(actions[GameStates.READY]);
			switch(prevGameState){
				case GameStates.FINISHED:
					exec(actions[GameStates.READY+'_AND_PREV_'+GameStates.FINISHED]);
					break;
			}
			break;
		case GameStates.RUNNING:
			exec(actions[GameStates.RUNNING]);
			switch(prevGameState){
				case GameStates.READY:
					exec(actions[GameStates.RUNNING+'_AND_PREV_'+GameStates.READY]);
					break;
				case GameStates.PAUSED:
					exec(actions[GameStates.RUNNING+'_AND_PREV_'+GameStates.PAUSED]);
					break;
				case GameStates.FINISHED:
					exec(actions[GameStates.RUNNING+'_AND_PREV_'+GameStates.FINISHED]);
					break;
			}
			break;
		case GameStates.PAUSED:
			exec(actions[GameStates.PAUSED]);
			switch(prevGameState){
				case GameStates.RUNNING:
					exec(actions[GameStates.PAUSED+'_AND_PREV_'+GameStates.RUNNING]);
					break;
			}
			break;
		case GameStates.FINISHED:
			exec(actions[GameStates.FINISHED]);
			switch(prevGameState){
				case GameStates.RUNNING:
					exec(actions[GameStates.FINISHED+'_AND_PREV_'+GameStates.RUNNING]);
					break;
				case GameStates.PAUSED:
					exec(actions[GameStates.FINISHED+'_AND_PREV_'+GameStates.PAUSED]);
					break;
			}
			break;
	}
}

export default class Game extends Component{
	
	state={
		timer: null,
		overlay: false,
		startScreen: true,
		finishScreen: false
	}


	componentDidUpdate(prevProps){
		const actions = {
			[GameStates.FINISHED]: [()=>this.finish()],
			[GameStates.RUNNING+'_AND_PREV_'+GameStates.PAUSED]: [()=>this.resumeTimer()],
			[GameStates.PAUSED+'_AND_PREV_'+GameStates.RUNNING]: [()=>this.pauseTimer()],
			[GameStates.RUNNING+'_AND_PREV_'+GameStates.READY]: [()=>this.startTimer()]
		}
		execRuntimeActions(this.props.gameState, prevProps.gameState, actions);
	}

	setTimeout(){
		return setInterval(()=>{
			this.props.countdown()
		}, timerBase);
	}

	startTimer(){
		this.props.setTime(this.props.timeout*60);
		this.setState({
			timer: this.setTimeout()
		})
	}

	pauseTimer(){
		this.clearTimer()
	}

	resumeTimer(){
		this.setState({
			timer: this.setTimeout()
		})
	}

	finish(){
		this.clearTimer();
		this.setState({finishScreen: true});
	}

	clearTimer(){
		clearInterval(this.state.timer)
	}

	render(){		
		return (
			<div style={style.container}>
				<GamePanel/>
				<Dialog
					open={this.state.startScreen}
					actions={
						<RaisedButton
							label="OK"
							primary={true}
							onClick={()=>this.setState({startScreen: false})}
						/>
					}
				>
					{this.props.startScreenContent}
				</Dialog>
				<Dialog
					open={this.state.finishScreen}
					actions={
						<RaisedButton
							label="OK"
							primary={true}
							onClick={()=>this.setState({finishScreen: false})}
						/>
					}
				>
					{this.props.finishScreenContent}
				</Dialog>
				{this.props.children}
			</div>
		)
	}
}

const style = {
	container: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column'
	},

}

Game.propsTypes = {
	gameState: PropTypes.string.isRequired,
	time: PropTypes.number,
	timeout: PropTypes.number,

	setTime: PropTypes.func
}
