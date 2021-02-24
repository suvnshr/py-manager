import React, { useState } from 'react';

import {
	ListItem,
	ListItemIcon,
	IconButton,
	ListItemText,
	ListItemSecondaryAction,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';

export default function InstallConfirmPackageListItem({
	packageName,
	packageData,
	removePackageFromInstallList,
}) {

	const [currentVersion, setCurrentVersion] = useState(
		packageData.latestVersion,
	);

	const handleVersionChange = ev => {
		setCurrentVersion(ev.target.value);
	};

	return (
		<ListItem divider>
			<ListItemIcon>
				<IconButton
					edge="start"
					onClick={() =>
						removePackageFromInstallList(packageName)
					}
				>
					<Delete />
				</IconButton>
			</ListItemIcon>

			<ListItemText
				primary={packageName}
				// secondary={packageData.summary}
				// secondaryTypographyProps={{
				// 	noWrap: true,
				// }}
			/>

			<ListItemSecondaryAction>
				<FormControl>
					<InputLabel>Version</InputLabel>

					<Select
						value={currentVersion}
						onChange={handleVersionChange}
					>
						{packageData.versions.map((version, index) => (
							<MenuItem
								key={`version-item-${packageName}-${index}`}
								value={version}
							>
								{version}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</ListItemSecondaryAction>
		</ListItem>
	);
}
