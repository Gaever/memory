import { connect } from 'react-redux';
import * as actions from '@actions';
import Game from '@components/Game';
import {mapConfigToProps} from '@/config';

const mapStateToProps = (state, ownProps) => {
	return {
		gameState: state.game.gameState,
		time: state.game.time,
		timeout: mapConfigToProps(state.game.config).timeout,
		startScreenContent: state.game.startScreenContent,
		finishScreenContent: state.game.finishScreenContent
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	countdown: () => dispatch(actions.countdown()),
	setTime: (value) => dispatch(actions.set('time', value))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Game)