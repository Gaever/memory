export const timerBase = 1000;
export const tick = 1;//sec

export const mapConfigToProps = (config = []) => {
	var props = {}
	config.forEach(item => {
		props[item.key] = item.values[item.valueKey];
	})
	return props;
}


export const Games = [
	{
		key: 'search',
		title: 'Поиск',
		config: [
			{
				key: 'matrixSize',
				label: 'Размер поля',
				values: [5,10,15,20],
				valueKey: 0
			},
			{
				key: 'frameSize',
				label: 'Размер рамки',
				values: [2,3,4,5],
				valueKey: 1
			},
			{
				key: 'timeout',
				label: 'Время, мин.',
				values: [1,2,3,5],
				valueKey: 1
			}
		],
		startScreenContent: 'start screen',
		finishScreenContent: 'finish screen'
	},
	{
		key: 'summ',
		title: 'Сумма',
		config: [
			{
				key: 'matrixSize',
				label: 'Размер поля',
				values: [5,10,15,20],
				valueKey: 0
			},
			{
				key: 'summ',
				label: 'Искомая сумма',
				values: [10,50,100,300],
				valueKey: 0
			},
			{
				key: 'timeout',
				label: 'Время, мин.',
				values: [1,2,3,5],
				valueKey: 1
			}
		],
		startScreenContent: 'start screen',
		finishScreenContent: 'finish screen'
	},
	{
		key: 'shultz',
		title: 'Таблица Шульте',
		config: [
			{
				key: 'matrixSize',
				label: 'Размер поля',
				values: [3,5,7,10],
				valueKey: 0
			},
			{
				key: 'symbolType',
				label: 'Набор символов',
				values: ['digit', 'lat', 'cyr'],
				showValues: ['Цифры', 'Латиница', 'Кирилица'],
				valueKey: 0
			},
			{
				key: 'timeout',
				label: 'Время, мин.',
				values: [1,2,3,5],
				valueKey: 1
			},
			{
				key: 'showDot',
				label: 'Показывать точку',
				values: [true, false],
				showValues: ['Да', 'Нет'],
				valueKey: 0
			}
		],
		startScreenContent: 'start screen',
		finishScreenContent: 'finish screen'
	},
]
