import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ThemeProvider } from 'styled-components';
import { Platform, StatusBar } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import setupApolloClient from './config/setup';
import Colors from './constants/Colors';
import { Bg } from './components/styled';
import theme from './config/theme';

export const ThemeContext = React.createContext<{
	theme: 'light' | 'dark';
	toggleTheme(): void;
} | null>(null);

interface AppState {
	isLoadingComplete: boolean;
	hasHydrated: boolean;
	theme: 'light' | 'dark';
}

export default class App extends React.Component<{}, AppState> {
	apolloClient: ApolloClient<{}> | null = null;

	state: AppState = {
		isLoadingComplete: false,
		hasHydrated: false,
		theme: 'light' as 'light'
	};

	toggleTheme = (): void => {
		this.setState(
			({ theme }) => ({
				theme: theme === 'light' ? 'dark' : 'light'
			}),
			this._changeStatusBarStyle
		);
	};

	_changeStatusBarStyle = (): void => {
		StatusBar.setBarStyle(
			this.state.theme === 'light' ? 'default' : 'light-content'
		);
	};

	componentDidMount() {
		return Platform.OS === 'ios' && this._changeStatusBarStyle();
	}

	_makeTheme = () => {
		return {
			color: Colors,
			...theme(this.state.theme)
		};
	};

	render() {
		const { isLoadingComplete, hasHydrated } = this.state;

		if (!isLoadingComplete && !hasHydrated) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		} else {
			return (
				!!this.apolloClient && (
					<ApolloProvider client={this.apolloClient}>
						<ThemeContext.Provider
							value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}
						>
							<ThemeProvider theme={this._makeTheme()}>
								<Bg forceInset={{ bottom: 'never' }}>
									<AppNavigator />
								</Bg>
							</ThemeProvider>
						</ThemeContext.Provider>
					</ApolloProvider>
				)
			);
		}
	}

	_loadResourcesAsync = async (): Promise<void> => {
		this.apolloClient = await setupApolloClient();

		Promise.all([
			Asset.loadAsync([
				require('./assets/images/robot-dev.png'),
				require('./assets/images/robot-prod.png')
			]),
			Font.loadAsync({
				// This is the font that we are using for our tab bar
				...Icon.Ionicons.font,
				// We include SpaceMono because we use it in HomeScreen.js. Feel free
				// to remove this if you are not using it in your app
				'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
				Menlo: require('./assets/fonts/Menlo-Regular.ttf')
			})
		]);
	};

	_handleLoadingError = (error: Error): void => {
		// In this case, you might want to report the error to your error
		// reporting service, for example Sentry
		console.warn(error);
	};

	_handleFinishLoading = (): void => {
		this.setState({ isLoadingComplete: true, hasHydrated: true });
	};
}
