import React, { Component } from "react";
import PropTypes from 'prop-types'

export default class GameGrid extends Component{
	getRows(){
		return this.props.matrix.map( (row, i) => 
			<div style={style.row} key={i}>
				{
					row.map( (cell, j) => {
						let s = (
								this.props.highlighted 
								&& this.has(this.props.highlighted, [i,j])
							)
							? {...style.cell, ...style.highlight}
							: style.cell;
							
						return <div style={s} key={j} className="gamecell" id={`${i}_${j}`}>{cell}</div>
					}
				)}
			</div>
		)
	}

	has(arr, element){
		var result = false;
		arr.forEach( item => {
			if(item[0] == element[0] && item[1] == element[1]){
				result = true;
			}
		})
		return result
	}

	render(){
		if(!this.props.matrix){return null}
		return (
			<div style={style.container}>
				{this.getRows()}
			</div>
		);
	}
}

GameGrid.propTypes = {
	matrix: PropTypes.arrayOf(PropTypes.array),
	highlighted: PropTypes.arrayOf(PropTypes.array)
}

const style = {
	container: {
		display: 'flex',
		height: '100%',
		paddingTop: '3px',
		paddingBottom: '3px',
		flexDirection:'column',
	},
	row: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		margin: '5px'
	},
	cell:{
		display: 'flex',
		height: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		background: '#dcdcdc',

		margin: '5px',
		fontWeight:'bold',
		fontSize: '1rem'
	},
	highlight:{
		background: '#FFDD94'
	}
}