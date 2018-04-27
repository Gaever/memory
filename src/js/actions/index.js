const camelToSneak = (s) => 
 s.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");

export const set = (key, value) => ({
	type: 'SET',
	payload:{ key, value }
})

export const incScore = (score = null) => ({
	type: 'INC_SCORE',
	payload: { score }
})

export const decScore = (score = null) => ({
	type: 'DEC_SCORE',
	payload: { score }
})

export const init= (game) => ({
	type: 'INIT',
	payload: { game }
})

export const setConfig= (key, valueKey) => ({
	type: 'SET_CONFIG',
	payload: { key, valueKey }
})

export const finish= () => ({
	type: 'FINISH',
})

export const start = () => ({
	type: 'START',
})

export const pause = () => {
	return {type: 'PAUSE',}
}

export const reset = () => ({
	type: 'RESET',
})

export const countdown = () => ({
	type: 'COUNTDOWN',
})

export const GameStates = {
	READY: 'READY',
	RUNNING: 'RUNNING',
	PAUSED: 'PAUSED',
	FINISHED: 'FINISHED'
}
