import React, { Component } from "react";
import { GameStates } from '@actions';
import { execRuntimeActions } from '@components/Game';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Game from '@containers/GameContainer';
import {Games} from '@/config';
import Settings from '@containers/Settings';
import Overlay from '@components/Overlay';

import SearchGame from '@containers/SearchGameContainer';
import SummGame from '@containers/SummGameContainer';
import ShultzGame from '@containers/ShultzGameContainer';

export default class Main extends Component{
	state={
		settingsDialogOpen: false,
		overlay: false,
		game: null,
		gameComponent: null,
		title: null
	}

	componentDidMount(){
		this.initGame(Games[0]);
	}

	initGame(game){
		this.props.init(game);
		this.props.reset();

		var gameComponent;
		switch(game.key){
			case 'search':
				gameComponent = <SearchGame/>;
				break;
			case 'summ':
				gameComponent = <SummGame/>;
				break;
			case 'shultz':
				gameComponent = <ShultzGame/>;
				break;
		}

		this.setState({
			game, 
			gameComponent,
			title: game.title,
		})
	}

	componentDidUpdate(prevProps){
		const actions = {
			[GameStates.RUNNING+'_AND_PREV_'+GameStates.PAUSED]: [()=>{
				if(!this.state.settingsDialogOpen){
					this.setState({overlay: false})
				}
			}],
			[GameStates.PAUSED+'_AND_PREV_'+GameStates.RUNNING]: [()=>{
				if(!this.state.settingsDialogOpen){
					this.setState({overlay: true})
				}
			}],
			[GameStates.FINISHED]: [()=>this.props.reset()],
		}
		execRuntimeActions(this.props.gameState, prevProps.gameState, actions);
	}

	openSettings = () => {
		if(this.props.gameState !== GameStates.READY){
			this.props.pause()
		}
		this.setState({settingsDialogOpen: true})
	}

	saveSettings = () => {
		if(this.props.gameState !== GameStates.READY){
			this.props.reset();
		}
		this.setState({settingsDialogOpen: false})
	}

	cancelSettings = () => {
		if(this.props.gameState !== GameStates.READY){
			this.props.start();
		}
		this.setState({settingsDialogOpen: false})
	}

	getMenu(){
		return(
			<IconMenu
				iconButtonElement={
					<IconButton>
						<NavigationMenu color="white"/>
					</IconButton>
				}
			>
			{Games.map((game, key) => (
				<MenuItem 
					key={key}
					primaryText={game.title}
					onClick={() => this.initGame(game)}
				/>
			))}
			</IconMenu>
		);
	}


	render(){
		return (
			<div style={style.container}>
				<AppBar
					title={`"${this.state.title}"`}
					iconElementRight={
						<IconButton onClick={this.openSettings}>
							<ActionSettings/>
						</IconButton>
					}
					iconElementLeft={this.getMenu()}
				/>
				<div style={style.field}>
					<Overlay show={this.state.overlay}>
						<RaisedButton 
							primary={true} 
							label="Продолжить"
							onClick={() => this.props.start()}
						/>
					</Overlay>
					<Game>{this.state.gameComponent}</Game>
				</div>
				<Dialog
					open={this.state.settingsDialogOpen}
					actions={null}
				>
					<Settings 
						onSave={this.saveSettings} 
						onCancel={this.cancelSettings}
					/>
				</Dialog>
			</div>
		);
	}
}

const style = {
	container: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	field:{
		flex: 1
	},
}