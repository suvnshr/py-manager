import React, { useState, useEffect } from 'react';

import axios from 'axios';

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
	CircularProgress,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const { ipcRenderer } = window.require('electron');


export default function InstallConfirmPackageListItem({
	packageName,
	removePackageFromInstallList,
	getFinalPackages,
	setFinalPackages,
}) {
	const [currentVersion, setCurrentVersion] = useState(null);
	const [packageData, setPackageData] = useState({});

	const [loading, setLoading] = useState(true);

	const handleVersionChange = ev => {
		setCurrentVersion(ev.target.value);
	};

	useEffect(() => {
		ipcRenderer.invoke('GET_PYPI_PACKAGE_DATA', packageName);

		ipcRenderer.on(
			'PYPI_PACKAGE_DATA_OF_' + packageName,
			(ev, _packageData) => {
				const latestVersion = _packageData.info.version;

				setPackageData(_packageData);
				setCurrentVersion(latestVersion);
				setLoading(false);
			},
		);
	}, []);

	useEffect(() => {
		if (currentVersion !== null) {
			let _finalPackages = getFinalPackages();
			_finalPackages[packageName] = currentVersion;

			setFinalPackages(_finalPackages);
		}
	}, [currentVersion]);

	const loader = <CircularProgress size={25} />;

	return (
        <ListItem divider>
			<ListItemIcon
				onClick={
					!loading
						? () => removePackageFromInstallList(packageName)
						: null
				}
			>
				<IconButton edge="start" size="large">
					{loading ? loader : <Delete />}
				</IconButton>
			</ListItemIcon>

			<ListItemText primary={packageName} />

			<ListItemSecondaryAction>
				{loading ? (
					loader
				) : (
					<FormControl>
						<InputLabel>Version</InputLabel>

						<Select
							value={currentVersion}
							onChange={handleVersionChange}
						>
							{Object.keys(packageData.releases).map(
								(version, index) => (
									<MenuItem
										key={`install-confirm-version-item-${packageName}-${index}`}
										value={version}
									>
										{version}
									</MenuItem>
								),
							)}
						</Select>
					</FormControl>
				)}
			</ListItemSecondaryAction>
		</ListItem>
    );
}
