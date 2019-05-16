import React from 'react';
import { Switch, ViewPropsAndroid } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import FullLoading from '../../components/FullLoading';
import {
	Body,
	Heading,
	Wrapper,
	Spacer,
	Scroll,
	Input,
	Button
} from '../../components/styled';

interface ICreateHabitState {
	title: string;
	description: string;
	starred: boolean;
	error: Error | null;
}

export default class CreateHabit extends React.Component<
	NavigationScreenProps,
	ICreateHabitState
> {
	state: ICreateHabitState = {
		title: '',
		description: '',
		starred: false,
		error: null
	};

	_change = (type: keyof ICreateHabitState, value: string): void => {
		this.setState({
			[type]: value,
			error: null
		});
	};
	_getErrorMessage = (): string => {
		const { title, description } = this.state;
		if (!title) {
			return 'Title is missing';
		}
		if (!description) {
			return 'Description is missing';
		} else {
			return 'Fields are mandatory';
		}
	};

	_goToRegister = (): void => {
		this.props.navigation.navigate('Register');
	};

	_createHabit = async () => {
		console.log('create habit');
		const { title, description, starred } = this.state;
		if (!title || !description) {
			const error = thisViewPropsAndroid;
			return this.setState({ error });
		}

		try {
			await this.props.createHabit({
				variables: {
					id: '',
					title,
					description,
					starred
				},
				optimisticResponse: {
					__typename: 'Mutation',
					createHabit: {
						__typename: 'Habit',
						id: Math.random().toString(), // uuid
						title,
						description,
						starred,
						habits: []
					}
				}
			});

			this.props.navigation.goBack();
		} catch (err) {
			this.setState({
				error:
					err.graphQLErrors.length > 0
						? err.graphQLErrors[0].message
						: 'Something went wrong.'
			});
		}
	};

	_renderCreateHabitForm = () => {
		const { title, description, starred, error } = this.state;
		return (
			<Wrapper>
				<Heading left large>
					CREATE HABIT
				</Heading>
				<Body left placeholder tiny>
					Title
				</Body>
				<Input
					defaultValue={title}
					onChangeText={e => this._change('title', e)}
				/>
				<Body left placeholder tiny>
					Description
				</Body>
				<Input
					multiline={true}
					defaultValue={description}
					onChangeText={e => this._change('description', e)}
				/>
				<Body left placeholder tiny>
					Favorite Habit?
				</Body>
				<Switch
					value={starred}
					onValueChange={() => this._change('starred', !starred)}
					trackColor={this.props.theme.colors.primary}
				/>
				<Spacer big>
					{error && (
						<Body error noMargin>
							{error}
						</Body>
					)}
				</Spacer>
				<Button onPress={this._createHabit} primary huge>
					<Body white center noMargin>
						CREATE HABIT
					</Body>
				</Button>
			</Wrapper>
		);
	};

	render() {
		if (this.props.createHabit.loading) {
			return <FullLoading />;
		}
		return <Scroll>{this._renderCreateHabitForm()}</Scroll>;
	}
}
