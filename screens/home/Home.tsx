import React from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import FullLoading from '../../components/FullLoading';
import {
	Body,
	Heading,
	HabitSquare,
	Wrapper,
	Row,
	Block,
	Scroll,
	FabButton
} from '../../components/styled';

export default class Home extends React.Component<NavigationScreenProps> {
	static navigationOptions = {
		header: null
	};

	_onFabPress = () => {
		this.props.navigation.navigate('CreateHabit');
	};

	_renderHabits = () => {
		const { habits } = this.props.data;

		return (
			<Wrapper>
				<Heading left large>
					HABITS
				</Heading>
				{habits.length > 0
					? this._renderHabitsList()
					: this._renderEmptyState()}
			</Wrapper>
		);
	};

	_renderEmptyState = () => {
		return (
			<Block>
				<Body placeholder noMargin>
					You have no habits :-(. Most of us have habits right? So please add
					one :)
				</Body>
			</Block>
		);
	};

	_renderHabitsList = () => {
		const { habits } = this.props.data;

		return (
			<React.Fragment>
				{habits.map(habit => {
					return (
						<Block key={habit.id} huge>
							<Body noMargin medium>
								{habit.title} {habit.starred && '🌟'}
							</Body>
							<Body placeholder tiny>
								{habit.description}
							</Body>
							<Row wrap>
								{habit.habits.map(day => {
									return (
										<HabitSquare key={day.id} done={day.done}>
											<Body stiny white={day.done} center noMargin>
												{new Date(day.date).getDate()}
											</Body>
										</HabitSquare>
									);
								})}
							</Row>
						</Block>
					);
				})}
			</React.Fragment>
		);
	};

	componentWillMount() {
		// this._logout();
	}

	_logout = () => {
		Promise.all([AsyncStorage.clear(), this.props.client.cache.reset()]).then(
			() => {
				this.props.navigation.navigate('Auth');
			}
		);
	};

	render() {
		if (this.props.data.loading && !this.props.data.habits) {
			return <FullLoading />;
		}

		return (
			<React.Fragment>
				<Scroll>{this._renderHabits()}</Scroll>
				<FabButton onPress={this._onFabPress} big>
					<Body white noMargin xlarge center>
						+
					</Body>
				</FabButton>
			</React.Fragment>
		);
	}
}
