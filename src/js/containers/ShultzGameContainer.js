import { connect } from 'react-redux';
import * as actions from '@actions';
import ShultzGame from '@components/ShultzGame';
import {mapConfigToProps} from '@/config';

const mapStateToProps = (state, ownProps) => {
	return {
		gameState: state.game.gameState,
		...mapConfigToProps(state.game.config)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	incScore: () => dispatch(actions.incScore(2)),
	decScore: () => dispatch(actions.decScore()),
	finish: () => dispatch(actions.finish()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ShultzGame)
