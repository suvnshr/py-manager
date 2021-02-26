import React, { useEffect, useState, useContext } from 'react';
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

import { SlideDialogTransition } from '../../commons/helpers';
import InstallConfirmPackageListItem from './InstallConfirmPackageListItem';
const {ipcRenderer} = window.require("electron");

export default function InstallConfirmDialog({
	open,
	packagesToInstall,
	setPackagesToInstall,
	handleConfirmInstallClose,
}) {
	const [finalPackages, setFinalPackages] = useState({});

	const getFinalPackages = _ => ({ ...finalPackages });

	const installPackages = () => {
		console.log('Packages to Install:', finalPackages);

		ipcRenderer.invoke("PACKAGES_INSTALL", finalPackages);

	};

	// Removes a package from `packagesToInstall`
	const removePackageFromInstallList = packageName => {
		let _newPackagesToInstall = [...packagesToInstall];
		const indexOfPackage = _newPackagesToInstall.indexOf(packageName);

		if (indexOfPackage !== -1) {
			_newPackagesToInstall.splice(indexOfPackage, 1);
			setPackagesToInstall(_newPackagesToInstall);

			let _finalPackages = {...finalPackages};
			delete _finalPackages[packageName];
			setFinalPackages(_finalPackages);
		}
	};

	useEffect(() => {

		ipcRenderer.on("INSTALL_OUTPUT", function(ev, installOutput) {
			console.log("Output: ", installOutput);
		})

		ipcRenderer.on("PACKAGE_STATUS_AFTER_INSTALL", function(ev, packageName, packageMessage) {
			console.log(packageName, packageMessage);
		});

		if (packagesToInstall.length === 0) {
			handleConfirmInstallClose();
		}
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
					{packagesToInstall.length === 0 ? (
						<Grid container justify="center">
							<CircularProgress />
						</Grid>
					) : (
						packagesToInstall.map((packageName, index) => (
							<InstallConfirmPackageListItem
								key={`install-confirm-package-list-item-${packageName}-${index}`}
								{...{
									packageName,
									removePackageFromInstallList,
									getFinalPackages,
									setFinalPackages,
								}}
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