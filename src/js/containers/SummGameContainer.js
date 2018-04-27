import { connect } from 'react-redux';
import * as actions from '@actions';
import SummGame from '@components/SummGame';

const mapStateToProps = (state, ownProps) => {
	return {
		gameState: state.game.gameState,
		size: state.game.matrixSize,
		frameSize: state.game.frameSize,
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	incScore: () => dispatch(actions.incScore(2)),
	decScore: () => dispatch(actions.decScore()),
	setGivenCondition: (value) => dispatch(actions.set('givenCondition', value)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SummGame)