import React, { Component } from "react";
import PropTypes from 'prop-types';
import { execRuntimeActions } from '@components/Game';
import { GameStates } from '@actions'
import GameGrid from './GameGrid';

const Dot = ({show}) => {
	return show ? <div style={style.dot}></div> : null
}

export default class ShultzGame extends Component{

	latins='ABCDEFGHIJKLMNOPQRSTUVWXY';
	cyrilics='АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩ';
	symbols = null;

	state={
		matrix: null,
		selection: null,
		nextElement: null,
	}

	componentDidMount(){
		this.clearAll();
	}

	updateConfigHandler(prevProps){
		if(
			(this.props.gameState == GameStates.READY)
			&& (
				this.props.symbolType !== prevProps.symbolType
				|| this.props.matrixSize !== prevProps.matrixSize
				|| this.props.timeout !== prevProps.timeout
			)
		){
			this.clearAll()
		}
	}

	componentDidUpdate(prevProps){
		this.updateConfigHandler(prevProps);
		const actions = {
			[GameStates.READY]: [()=>this.clearAll()],
			[GameStates.RUNNING+'_AND_PREV_'+GameStates.READY]: [()=>this.init()],
			[GameStates.FINISHED]: [()=>this.clearAll()]
		};
		execRuntimeActions(this.props.gameState, prevProps.gameState, actions);
	}

	init(){
		var filler;
		switch(this.props.symbolType){
			case 'digit':
				filler = (i,j) => this.randomUniqueIntegerFiller(i, j, 1, Math.pow(this.props.matrixSize, 2));
				break;
			case 'lat':
				filler = () => this.randomUniqueLatinFiller();
				break;
			case 'cyr':
				filler = () => this.randomUniqueCyrilicFiller();
				break;
		}
		this.setState({ 
			matrix: this.fillMatrix(filler),
			nextElement: 0,
			showDot: this.props.showDot
		});
		this.initListeners();
	}

	clearAll(){
		this.setState({
			matrix: this.fillMatrix(()=>''),
			selection: null,
		})
		this.symbols = null;
		this.clearListeners();
	}

	initListeners(){
		document.addEventListener("click", this.onClick)
	}

	clearListeners(){
		document.removeEventListener("click", this.onClick)
	}

	onClick = (event) =>{
		if(event.target.className == 'gamecell'){
			const rowCol = event.target.id.split('_');
			this.processAnswer(rowCol[0], rowCol[1]);
		}
	}

	appendSelection(row,col){
		if(!this.state.selection){
			this.setState({selection: [[row,col]]})
			return;
		}

		var has = this.state.selection.find(item => (item[0] === row) && (item[1] === col));
		if(has !== undefined ){return;}

		var selection = [...this.state.selection]
		selection.push([row, col])
		this.setState({selection});
	}

	processAnswer(row, col){
		const {nextElement} = this.state;
		var answer = false, _nextElement;
		switch(this.props.symbolType){
			case 'digit':
				_nextElement = nextElement + 1;
				break;
			case 'lat':
				_nextElement = this.latins[nextElement];
				break;
			case 'cyr':
				_nextElement = this.cyrilics[nextElement];
				break;
		}


		if(this.state.matrix[row][col] == _nextElement){
			answer = true;
		}

		if(answer){
			this.appendSelection(row, col);
			if(nextElement + 1 < Math.pow(this.props.matrixSize,2)){
				this.setState({nextElement: nextElement + 1});
			} else {
				this.props.finish()
			}
			this.props.incScore()
		} else {
			this.props.decScore()
		}
	}

	fillMatrix(filler){
		var matrix = [];
		for(var i = 0; i < this.props.matrixSize; i++){
			var row = [];
			for(var j = 0; j < this.props.matrixSize; j++){
				row.push(filler(i,j))
			}
			matrix.push(row)
		}
		return matrix;
	}

	popRandom(array){
		var value = array.splice(Math.floor(Math.random()*array.length), 1);
		return value[0];
	}

	randomUniqueIntegerFiller(row, col, min, max){
		if(!this.symbols || this.symbols.length == 0){
			var list = [];
			for (var i = min; i <= max; i++) {
				list.push(i);
			}
			this.symbols = list;
		}
		var symbols = this.symbols;
		var value = this.popRandom(symbols);
		this.symbols = symbols;
		return value;
	}

	randomUniqueLatinFiller(){
		if(!this.symbols || this.symbols.length == 0){
			this.symbols = this.latins.split('');
		}
		var symbols = this.symbols;
		var value = this.popRandom(symbols);
		this.symbols = symbols;
		return value;
	}

	randomUniqueCyrilicFiller(){
		if(!this.symbols || this.symbols.length == 0){
			this.symbols = this.cyrilics.split('');
		}
		var symbols = this.symbols;
		var value = this.popRandom(symbols);
		this.symbols = symbols;
		return value;
	}

	render(){
		return (
			<div style={style.container}>
				<Dot show={this.props.showDot}/>
				<GameGrid
					matrix={this.state.matrix}
					highlighted={this.state.selection}
				/>
			</div>
		);
	}
}

const style = {
	container:{
		display: 'flex',
		flexDirection: 'column',
		height:'100%'
	},
	dot:{
		position:'absolute',
		zIndex: 10,
		top: '50%',
		left: '50%',
		width: 50,
		height: 50,
		marginLeft: '-25px',
		marginTop: '34px',
		backgroundColor: 'green',
		borderRadius:'25px',
		opacity: 0.5
	}
}

/*
ShultzGame.propsTypes = {
	gameState: PropTypes.string.isRequired,
	size: PropTypes.number.isRequired,
	frameSize: PropTypes.number.isRequired,

	setGivenCondition: PropTypes.func.isRequired,
	incScore: PropTypes.func.isRequired,
	decScore: PropTypes.func.isRequired
}
*/