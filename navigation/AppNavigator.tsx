import React from 'react';
import { Platform, AsyncStorage } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import {
	createStackNavigator,
	createBottomTabNavigator,
	createSwitchNavigator,
	createAppContainer
} from 'react-navigation';

import FullLoading from '../components/FullLoading';

// Auth
import Login from '../screens/login/Container';
import Register from '../screens/register/Container';
import Home from '../screens/home/Container';
import CreateHabit from '../screens/createHabit/Container';
import Mood from '../screens/mood/Container';
import Settings from '../screens/settings/Container';
import { USER_ACCESS_TOKEN } from '../constants/auth';
import TabBarIcon from './TabBarIcon';
import ThemedTabBar from './ThemedTabBar';

const HomeStack = createStackNavigator(
	{
		Home: {
			screen: Home
		}
	},
	{
		headerMode: 'none',
		navigationOptions: {
			tabBarLabel: 'Home',
			tabBarIcon: ({ focused }) => (
				<TabBarIcon
					focused={focused}
					name={Platform.OS === 'ios' ? 'ios-albums' : 'md-albums'}
				/>
			)
		}
	}
);

const MoodStack = createStackNavigator(
	{
		Mood: { screen: Mood }
	},
	{
		headerMode: 'none',
		navigationOptions: {
			tabBarLabel: 'Mood',
			tabBarIcon: ({ focused }) => (
				<TabBarIcon
					focused={focused}
					name={Platform.OS === 'ios' ? 'ios-pulse' : 'md-pulse'}
				/>
			)
		}
	}
);

const SettingsStack = createStackNavigator(
	{
		Settings: { screen: Settings }
	},
	{
		headerMode: 'none',
		navigationOptions: {
			tabBarLabel: 'Settings',
			tabBarIcon: ({ focused }) => (
				<TabBarIcon
					focused={focused}
					name={Platform.OS === 'ios' ? 'ios-cog' : 'md-cog'}
				/>
			)
		}
	}
);

const AppTabs = createBottomTabNavigator(
	{
		HomeTab: { screen: HomeStack },
		MoodTab: { screen: MoodStack },
		SettingsTab: { screen: SettingsStack }
	},
	{
		// initialRouteName: "MyTripsTab",
		initialRouteName: 'HomeTab',
		order: ['HomeTab', 'MoodTab', 'SettingsTab'],
		tabBarComponent: ThemedTabBar
	}
);

const AppRoutes = createStackNavigator(
	{
		AppTabs: { screen: AppTabs },
		CreateHabit: { screen: CreateHabit }
	},
	{
		initialRouteName: 'AppTabs',
		headerMode: 'none'
	}
);

const AuthStack = createStackNavigator(
	{
		Login: { screen: Login },
		Register: { screen: Register }
	},
	{
		headerMode: 'none'
	}
);

class Switch extends React.PureComponent<NavigationScreenProps> {
	constructor(props: NavigationScreenProps) {
		super(props);

		this._bootstrapAsync();
	}

	componentDidMount() {
		// LoginManager.logOut();
		// Alert.alert("XXX", JSON.stringify(this.props.client.clearStore, null, 2));
		// this.props.client.resetStore();
		// this.props.navigation.navigate("Auth");
		// this.props.client.clearStore();
	}

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {
		const token = await AsyncStorage.getItem(USER_ACCESS_TOKEN);

		// This will switch to the App screen or Auth screen and this loading
		// screen will be unmounted and thrown away.
		this.props.navigation.navigate(token ? 'App' : 'Auth');
	};

	// Render any loading content that you like here
	render() {
		return <FullLoading />;
	}
}

const RootSwitch = createAppContainer(
	createSwitchNavigator(
		{
			Switch: Switch,
			Auth: AuthStack,
			App: AppRoutes
		},
		{
			initialRouteName: 'Switch'
		}
	)
);

export default RootSwitch;

// import React from 'react';
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';

// import MainTabNavigator from './MainTabNavigator';

// export default createAppContainer(createSwitchNavigator({
//   // You could add another route here for authentication.
//   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//   Main: MainTabNavigator,
// }));
