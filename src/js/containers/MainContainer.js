import { connect } from 'react-redux';
import { pause, start, reset, init } from '@actions';
import Main from '@components/Main';


const mapStateToProps = (state, ownProps) => ({
	gameState: state.game.gameState
})

const mapDispatchToProps = dispatch => ({
	reset: () => dispatch(reset()),
	pause: () => dispatch(pause()),
	start: () => dispatch(start()),
	init: (game) => dispatch(init(game))
})

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Main)