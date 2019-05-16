import React from 'react';
import { Icon } from 'expo';
import { withTheme } from 'styled-components';

interface ITabBarIconProps {
	name: string;
	focused: boolean;
	theme: any;
}

class TabBarIcon extends React.Component<ITabBarIconProps> {
	render() {
		return (
			<Icon.Ionicons
				name={this.props.name}
				size={28}
				style={{ marginBottom: -3 }}
				color={
					this.props.focused
						? this.props.theme.colors.primary
						: this.props.theme.colors.placeholder
				}
			/>
		);
	}
}

export default withTheme(TabBarIcon);
