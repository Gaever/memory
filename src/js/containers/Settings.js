import React, { Component } from "react";
import { connect } from 'react-redux';
import { setConfig } from '@/actions';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Settings extends Component{

	constructor(props){
		super(props);
		this.state = this.getState();
	}

	getState(){
		var state = {};
		this.props.config.forEach(item=>{
			state[item.key] = item.valueKey;
		})
		return state;
	}

	getMenuItems(item){
		return item.values.map((v,valueKey) => {
			var primaryText = item.showValues
				? item.showValues[valueKey]
				: v;
			return (
				<MenuItem value={valueKey} primaryText={primaryText} key={valueKey}/>
			)
		})
	}

	getFields(){
		return this.props.config.map((item,index) => {
			return (
				<SelectField
					key={index}
					value={this.state[item.key]}
					onChange={ (e, i, valueKey) => this.setState({[item.key]: valueKey}) }
					floatingLabelText={item.label}
				>
					{this.getMenuItems(item)}
				</SelectField>
			)
		})
	}

	save = () => {
		this.props.config.forEach(item=>{
			this.props.setConfig(item.key, this.state[item.key]);
		})
		this.props.onSave();
	}

	cancel = () => {
		this.props.onCancel();
	}

	render(){
		return (
			<div>
				{this.getFields()}
				<div>
					<RaisedButton
						label="OK"
						primary={true}
						onClick={this.save}
						style={style}
					/>
					<FlatButton
						label="Отмена"
						onClick={this.cancel}
						style={style}
					/>
				</div>
			</div>
		);
	}
}

const style = {
	margin: 10
}

const mapStateToProps = state => ({config: state.game.config});
const mapDispatchToProps = dispatch => (
	{
		setConfig: (key, valueKey) => dispatch(setConfig(key,valueKey))
	}
)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Settings)