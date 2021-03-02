import React, { useState, useEffect } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import {
	Checkbox,
	ListItemSecondaryAction,
	ListItemIcon,
	IconButton,
	FormControl,
} from '@material-ui/core';
import { InfoOutlined, OpenInNewOutlined } from '@material-ui/icons';

import { isPackageInstalled } from '../../commons/helpers';
import routes from '../../commons/routes';
import { useHistory } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

export default function PackageSearchItem({
	packageName,
	packageData,
	packagesToInstall,
	setPackagesToInstall,
	installedPackages,
}) {
	const history = useHistory();

	// Whether `packageName` is in `installedPackages` list.
	const _isPackageInstalled = isPackageInstalled(
		packageName,
		installedPackages,
	);

	// Navigate to detail page of a installed package
	const goToDetailPage = ev => {
		history.push(routes.PACKAGE_DETAIL + packageName);
	};

	// Navigate to package's detail page on PYPI
	const goToPyPIDetailPage = ev => {
		ipcRenderer.invoke('OPEN_LINK', packageData.href);
	};

	// Whether the package is selected by user for installation
	const [_checked, setChecked] = useState(
		packagesToInstall.indexOf(packageName) !== -1,
	);

	// Add `packageName` to `packagesToInstall` if it is not already there.
	// Remove `packageName` from `packagesToInstall` if it is already there.
	const handlePackageAdditionForInstallation = () => {
		const indexOfPackage = packagesToInstall.indexOf(packageName);

		if (indexOfPackage === -1) {
			let _newPackagesToInstall = [...packagesToInstall, packageName];
			setPackagesToInstall(_newPackagesToInstall);
		} else {
			let _packagesToInstall = [...packagesToInstall];
			_packagesToInstall.splice(indexOfPackage, 1);
			setPackagesToInstall(_packagesToInstall);
		}
	};

	// If the user removes the package from `InstallConfirmDialog`
	// then this function will unselect the package
	const syncInstalledPackagesWithSelection = () => {
		const indexOfPackage = packagesToInstall.indexOf(packageName);

		if (indexOfPackage === -1) {
			setChecked(false);
		} else {
			setChecked(true);
		}
	};

	useEffect(syncInstalledPackagesWithSelection, [packagesToInstall]);

	return (
		<ListItem disableRipple divider={true} button>
			<ListItemIcon>
				<FormControl>
					{_isPackageInstalled ? (
						<Checkbox
							edge="start"
							tabIndex={-1}
							checked={true}
							color="primary"
						/>
					) : (
						<Checkbox
							edge="start"
							tabIndex={-1}
							onClick={() =>
								handlePackageAdditionForInstallation(
									packageName,
								)
							}
							checked={_checked}
						/>
					)}
				</FormControl>
			</ListItemIcon>
			<ListItemText
				primary={packageName}
				secondary={packageData.packageDescription}
			/>

			<ListItemSecondaryAction>
				<IconButton
					edge="end"
					onClick={
						_isPackageInstalled
							? goToDetailPage
							: goToPyPIDetailPage
					}
				>
					{_isPackageInstalled ? (
						<InfoOutlined fontSize="small" />
					) : (
						<OpenInNewOutlined fontSize="small" />
					)}
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
}
