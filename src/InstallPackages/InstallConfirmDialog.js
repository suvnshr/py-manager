import React, { useEffect, useState } from 'react';

import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	List,
	Typography,
} from '@mui/material';

import { SlideDialogTransition } from '../commons/helpers';
import InstallConfirmPackageListItem from './InstallConfirmPackageListItem';
import { GetApp } from '@mui/icons-material';
import customTheme from '../commons/theme';
import LazyLoadWrapper from '../commons/LazyLoadWrapper';

const { ipcRenderer } = window.require('electron');

export default function InstallConfirmDialog({
	open,
	packagesToInstall,
	setPackagesToInstall,
	handleConfirmInstallClose,
	handlePackageModalClose,
	setOpenInstallStatusModal,
	setSearchedPackages,
}) {
	const [finalPackages, setFinalPackages] = useState({});

	const getFinalPackages = _ => ({ ...finalPackages });

	const installPackages = () => {
		ipcRenderer.invoke('PACKAGES_INSTALL', finalPackages);
		handleConfirmInstallClose();
		handlePackageModalClose();
		setOpenInstallStatusModal(true);

		// Reset state
		setSearchedPackages(null);
		setPackagesToInstall([]);
		setFinalPackages({});
	};

	// Removes a package from `packagesToInstall`
	const removePackageFromInstallList = packageName => {
		let _newPackagesToInstall = [...packagesToInstall];
		const indexOfPackage = _newPackagesToInstall.indexOf(packageName);

		if (indexOfPackage !== -1) {
			_newPackagesToInstall.splice(indexOfPackage, 1);
			setPackagesToInstall(_newPackagesToInstall);

			let _finalPackages = { ...finalPackages };
			delete _finalPackages[packageName];
			setFinalPackages(_finalPackages);
		}
	};

	useEffect(() => {
		if (packagesToInstall.length === 0) {
			handleConfirmInstallClose();
		}
	}, [packagesToInstall]);

	return (
        <Dialog
            open={open}
            fullWidth
            TransitionComponent={SlideDialogTransition}
            maxWidth={'sm'}
            onClose={handleConfirmInstallClose}>
			<DialogTitle>
				<div>Choose version</div>
				<Typography
					variant="subtitle2"
					style={{ color: customTheme.palette.grey[400] }}
				>
					&nbsp;By default the latest versions are selected
				</Typography>
			</DialogTitle>
			<DialogContent>
				<List>
					{packagesToInstall.length === 0 ? (
						<Grid container justifyContent="center">
							<CircularProgress />
						</Grid>
					) : (
						packagesToInstall.map((packageName, index) => (
							<LazyLoadWrapper height={65}>
								<InstallConfirmPackageListItem
									key={`install-confirm-package-list-item-${packageName}-${index}`}
									{...{
										packageName,
										removePackageFromInstallList,
										getFinalPackages,
										setFinalPackages,
									}}
								/>
							</LazyLoadWrapper>
						))
					)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleConfirmInstallClose} color="primary">
					Cancel
				</Button>
				<Button
					onClick={installPackages}
					color="primary"
					variant="contained"
					color="primary"
					startIcon={<GetApp />}
				>
					Install all
				</Button>
			</DialogActions>
		</Dialog>
    );
}
