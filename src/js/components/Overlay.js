import React, { Component } from "react";

export default ({show, children}) => {
	return show 
		? (
			<div style={style.overlay}>
				<div style={style.overlayContent}>
					{children}
				</div>
			</div>
		)
		: null;
}


const style = {
	overlay:{
		position: 'absolute',
		display: 'flex',
		width: '100%',
		height: '100%',
		top: 0,
		backgroundColor:'rgba(0,0,0,0.6)',
		zIndex:10,
		display:'flex', 
		flexDirection: 'column', 
		flex: 1
	},

	overlayContent:{
		display:'flex', 
		flex: 1, 
		alignItems:'center', 
		justifyContent: 'center'
	}

}
