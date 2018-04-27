import { connect } from 'react-redux';
import * as actions from '@actions';
import SearchGame from '@components/SearchGame';
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
	setGivenCondition: (value) => dispatch(actions.set('givenCondition', value)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchGame)