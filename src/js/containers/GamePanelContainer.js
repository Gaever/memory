import { connect } from 'react-redux';
import * as actions from '@actions';
import GamePanel from '@components/GamePanel';

const mapStateToProps = (state, ownProps) => ({
  gameState: state.game.gameState,
  time: state.game.time,
  score: state.game.score,
  givenCondition: state.game.givenCondition
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  finish: () => dispatch(actions.finish()),
  reset: () => dispatch(actions.reset()),
  start: () => dispatch(actions.start()),
  pause: () => dispatch(actions.pause()),
  set: () => dispatch(actions.set())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePanel)