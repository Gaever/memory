import React, { Component } from "react";
import PropTypes from 'prop-types';
import { execRuntimeActions } from '@components/Game';
import { GameStates } from '@actions'
import GameGrid from './GameGrid';

export default class SummGame extends Component{
	KEY_YES='+';
	KEY_NO='-';

	state={
		matrix: null,
		frame: null,
		symbols: null,
	}

	componentDidMount(){
		this.clearAll();
	}

	updateConfigHandler(prevProps){
		if(
			(this.props.gameState == GameStates.READY)
			&& (
				this.props.matrixSize !== prevProps.matrixSize
				|| this.props.frameSize !== prevProps.frameSize
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
		const 
			matrix = this.fillMatrix(this.randomInteger),
			symbols = this.initSymbols(matrix),
			frame = this.fillFrame(this.getRandomFramePos());

		this.setState({
			matrix: matrix,
			symbols: symbols,
			frame: frame,
		})
		this.initListeners();
		this.props.setGivenCondition(symbols);
	}

	clearAll(){
		this.setState({
			matrix: this.fillMatrix(()=>''),
			frame: null,
			symbols: null
		})
		this.clearListeners();
	}

	initListeners(){
		document.addEventListener("keyup", this.onKeyUp)
	}

	clearListeners(){
		document.removeEventListener("keyup", this.onKeyUp)
	}

	onKeyUp = (event) =>{
		if([this.KEY_YES,this.KEY_NO].includes(event.key)){
			this.processAnswer(event.key);
		}
	}

	processAnswer(pressedKey){
		var correctAnswer = this.symbolsInFrame();		
		var answer;
		switch(pressedKey){
			case this.KEY_YES:
				answer = true;
				break;
			case this.KEY_NO:
				answer = false
				break;
		}
		if(correctAnswer === answer){
			this.props.incScore()
		} else {
			this.props.decScore()
		}
		this.moveFrame();
	}

	moveFrame(){
		this.setState({
			frame: this.fillFrame(this.getRandomFramePos()),
		})
	}

	initSymbols(matrix){
		var symbols = '';
		matrix.forEach(row => {
			row.forEach(cell => {
				symbols += cell;
			})
		})
		var symbols = [
			this.randomSymbol(false, false, symbols), 
			this.randomSymbol(false, false, symbols)
		]
		return symbols[0] === symbols[1]
			? this.initSymbols()
			: symbols;
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

	randomDigit(){
		return this.randomInteger(0,100);
	}

	randomSymbol(i = false, j = false, symbols = false) {
		var r = symbols 
			? symbols 
			: 'ABCDEFGHIJKLMNOPQRSTUVWXYZБГДЁЖЗИЙЛМПУФЦЧШЩЪЫЬЭЮЯ0123456789';
		return r.charAt(Math.floor(Math.random()*r.length));
	}

	fillFrame(pos){
		var {row, col} = pos,
			_col = col, 
			_row = row,
			frame = [];

		for(var i = 0; i < this.props.frameSize; i++){
			for(var j = 0; j < this.props.frameSize; j++){
				frame.push([_row, _col]);
				_col++;
			}
			_row++;
			_col = col;
		}
		return frame;
	}

	getRandomFramePos(){
		var a = {
			col: this.randomInteger(0, this.props.matrixSize - this.props.frameSize),
			row: this.randomInteger(0, this.props.matrixSize - this.props.frameSize)
		}
		return a;
	}

	randomInteger(min, max) {
		//var rand = min - 0.5 + Math.random() * (max - min + 1)
		//rand = Math.round(rand);
		//return rand;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	symbolsInFrame(){
		const {frame} = this.state;
		var count = 0;

		var found = [];
		for(var i=0; i < frame.length; i++){
			var row = frame[i][0], col = frame[i][1];
			var symbol = this.state.matrix[row][col];
			if(
				this.state.symbols.includes(symbol)
				&& !found.includes(symbol)
			){
				found.push(symbol);
			}
		}

		return found.length >= this.state.symbols.length;
	}

	render(){
		return (
			<GameGrid
				matrix={this.state.matrix}
				highlighted={this.state.frame}
			/>
		);
	}
}

