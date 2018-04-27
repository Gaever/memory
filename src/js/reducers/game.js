import {GameStates} from '@actions';
import {tick} from '@/config';

/*

schema: {
	gameState: String,
	givenCondition: Any,
	time: Number,
	score: Number,
	config: [
		{
			key: String
			label: String,
			values: Array,
			valueKey: Number
		},
		...
	],
	startScreenContent: Any,
	finishScreenContent: Any
}

*/

const initState = {
	gameState: GameStates.READY,
	givenCondition: null,
	time: null,
	score: 0,
}

export default (state = initState, action) => {
	var time;
	switch (action.type) {

		case 'SET':
			var newValue = {};
			newValue[action.payload.key] = action.payload.value;
			return {...state, ...newValue};

		case 'INIT': 
			const {
				config, 
				startScreenContent,
				finishScreenContent,
				key
			} = action.payload.game;
			return {
				...state, 
				gameKey: key,
				config,
				startScreenContent,
				finishScreenContent,
			};

		case 'SET_CONFIG':
			var config = state.config.map((item,i) => (
				item.key == action.payload.key
					? {...item, valueKey: action.payload.valueKey}
					: item
			));

			//Устанавливаем размер матрицы на 5x5 для буквенных символов
			if(state.gameKey == 'shultz'){
				if(action.payload.key == 'symbolType'){
					if(action.payload.valueKey !== 0){
						var config = config.map(item => item.key == 'matrixSize' ? {...item, valueKey: 1} : item)
					}
				} else {
					var isDigitSymbolType = 
						config.find(item => (item.key == 'symbolType') && (item.valueKey === 0)) != undefined
					if(!isDigitSymbolType){
						var config = config.map(item => {
							 return item.key == 'matrixSize'
								? {...item, valueKey: 1}
								: item
						})
					}
				}
			}

			return {...state, config};

		case 'INC_SCORE':
			return action.payload.score === null
				? {...state, score: state.score + 1}
				: {...state, score: state.score + action.payload.score};

		case 'DEC_SCORE':
			return action.payload.score === null
				? {...state, score: state.score - 1}
				: {...state, score: state.score - action.payload.score};

		case 'START':
			return {...state, gameState: GameStates.RUNNING};

		case 'PAUSE':
			return state.gameState !== GameStates.READY
				? {...state, gameState: GameStates.PAUSED}
				: state;

		case 'FINISH':
			time = ( (state.time !== undefined) && (state.time < tick) ) 
				? 0 
				: state.time;
			return {...state, gameState: GameStates.FINISHED, time };

		case 'RESET':
			return {
				...state, 
				...initState
			};

		case 'COUNTDOWN':
			time = state.time - tick
			return time < tick
				?{ ...state, time: 0, gameState: GameStates.FINISHED }
				:{ ...state, time };

		default:
			return state;
	}
}
