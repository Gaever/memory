import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MainContainer from '@containers/MainContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import rootReducer from '@reducers'

const store = createStore(rootReducer)

export default class App extends Component{
	serverUrl = 'http://localhost:3000/';

	render(){
		return (
			<Provider store={store}>
				<MuiThemeProvider>
					<MainContainer/>
				</MuiThemeProvider>
			</Provider>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));