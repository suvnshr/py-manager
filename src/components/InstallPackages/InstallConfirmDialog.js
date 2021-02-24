import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	List,
	Grid,
	Button,
	CircularProgress,
} from '@material-ui/core';

import axios from 'axios';
import { SlideDialogTransition } from '../../commons/helpers';
import InstallConfirmPackageListItem from './InstallConfirmPackageListItem';

export default function InstallConfirmDialog({
	open,
	packagesToInstall,
	setPackagesToInstall,
	handleConfirmInstallClose,
}) {
	const [packagesToInstallData, setPackagesToInstallData] = useState([]);

	const installPackages = () => {};

	// Removes a package from `packagesToInstall`
	const removePackageFromInstallList = packageName => {};

	// Populates the `packagesToInstallData`
	const populatePackageData = () => {
		packagesToInstall.forEach((packageName, index) => {
			let _newPackagesToInstallData = {};

			axios.get(`https://pypi.org/pypi/${packageName}/json`).then(res => {
				_newPackagesToInstallData[packageName] = {
					versions: Object.keys(res.data.releases),
					latestVersion: res.data.info.version,
				};

				if (index === packagesToInstall.length - 1) {
					setPackagesToInstallData(_newPackagesToInstallData);
				}
			});
		});
	};

	useEffect(() => {

		populatePackageData();

	}, [packagesToInstall]);

	return (
		<Dialog
			open={open}
			disableBackdropClick
			fullWidth
			TransitionComponent={SlideDialogTransition}
			maxWidth={'sm'}
			onClose={handleConfirmInstallClose}
		>
			<DialogTitle>Choose package version</DialogTitle>
			<DialogContent>
				<List>
					{Object.keys(packagesToInstallData).length === 0 ? (
						<Grid container justify="center">
							<CircularProgress />
						</Grid>
					) : (
						Object.entries(
							packagesToInstallData,
						).map(([packageName, packageData], index) => (
							<InstallConfirmPackageListItem
								packageName={packageName}
								packageData={packageData}
								removePackageFromInstallList={
									removePackageFromInstallList
								}
							/>
						))
					)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleConfirmInstallClose} color="primary">
					Back
				</Button>
				<Button
					onClick={installPackages}
					color="primary"
					variant="contained"
					color="primary"
				>
					Install packages
				</Button>
			</DialogActions>
		</Dialog>
	);
}
