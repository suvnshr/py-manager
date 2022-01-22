import React, { useEffect, useState, useContext } from 'react';

import {
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	Grid,
	InputAdornment,
	TextField,
} from '@mui/material';
import { GetApp, SearchOutlined } from '@mui/icons-material';

import InstallPackagesStatus from '../InstallPackages/InstallingPackageStatus';
import InstallPackagesDialog from '../InstallPackages/InstallPackagesDialog';
import PackageCard from './PackageCard';
import { PIPContext } from '../context/PIPContext';
import LazyLoadWrapper from '../commons/LazyLoadWrapper';

const { ipcRenderer } = window.require('electron');

function Home() {
	const [query, setQuery] = useState('');
	const [packageInstallModalOpen, setPackageInstallModalOpen] = useState(
		false,
	);
	const [openInstallStatusModal, setOpenInstallStatusModal] = useState(false);

	const { currentPIP, PIPContextLoaded, packages } = useContext(PIPContext);

	const handleInstallStatusClose = ev => {
		setOpenInstallStatusModal(false);

		// Receive updated list of packages after installation is complete
		// console.log("Calling `receivePackages` from `handleInstallStatusClose`...");

		receivePackages();
	};

	const handlePackageInstallModalClose = ev => {
		setPackageInstallModalOpen(false);
	};

	const handlePackageInstall = ev => {
		setPackageInstallModalOpen(true);
	};

	const receivePackages = ev => {
		ipcRenderer.invoke('RECEIVE_PACKAGES');
	};

	useEffect(() => {
		if (PIPContextLoaded) {
			// console.log("Calling `receivePackages` from useEffect...");

			// if `PIPContextLoaded` is true, then it means
			// that `currentPIP`, `defaultPIP` and `allPIPS` are loaded
			// and after that we call `receivePackages`

			// We used only one dependency(`currentPIP`) for useEffect...
			// out of 3 dependencies(`currentPIP`, `defaultPIP`, `allPIPS`)
			// so that the `receivePackages` function gets called only one time per page load, instead of 3 times.
			receivePackages();
		}
	}, [currentPIP, PIPContextLoaded]);

	const performSearch = ev => setQuery(ev.target.value.toLowerCase());

	const loader = <CircularProgress />;

	const noResultsFound = <div>No packages installed</div>;

	const packagesList = _ => {
		const filteredPackages = packages.filter(
			item => item.name.toLowerCase().indexOf(query) !== -1,
		);

		if (filteredPackages.length === 0) {
			return <div> No packages found for "{query}" </div>;
		}

		return filteredPackages.map((packageData, index) => (
			<Grid
				item
				xs={12}
				sm={6}
				md={4}
				lg={4}
				key={'package-card-' + packageData.name + index}
			>
				<LazyLoadWrapper height={190}>
					<PackageCard {...packageData} />
				</LazyLoadWrapper>
			</Grid>
		));
	};

	return (
        <div>
			<p />

			<Grid container>
				<Grid item sm={3} md={3} lg={4} />
				<Grid item xs={12} sm={6} md={6} lg={4}>
					<div>
						<p />
						<Grid container justifyContent="center">
							<TextField
								fullWidth={true}
								onKeyUp={performSearch}
								label="Search local packages"
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchOutlined color="primary" />
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<p />
					</div>

					<p />
				</Grid>
			</Grid>

			<p />
			<Divider light />
			<p />

			<Container>
				<Grid container justifyContent="space-between" style={{ padding: 20 }}>
					

					<Grid item>
						{packages !== null ? (
							<Button
								// variant="contained"
								color="secondary"
								onClick={handlePackageInstall}
								startIcon={<GetApp />}
							>
								Install packages
							</Button>
						) : null}
					</Grid>
					<Grid item>
						{packages !== null ? (
							<Chip
								component="span"
								variant="outlined"
								label={`${packages.length} packages installed`}
							/>
						) : null}
					</Grid>
				</Grid>

				<Grid container justifyContent="center">
					{packages === null
						? loader
						: packages.length === 0
						? noResultsFound
						: packagesList()}
				</Grid>
			</Container>

			{/* Modals */}

			{/* Modal to install packages */}
			<InstallPackagesDialog
				isOpen={packageInstallModalOpen}
				installedPackages={packages}
				handleClose={handlePackageInstallModalClose}
				setOpenInstallStatusModal={setOpenInstallStatusModal}
			/>

			{PIPContextLoaded ? (
				<InstallPackagesStatus
					currentPIP={currentPIP}
					isOpen={openInstallStatusModal}
					handleClose={handleInstallStatusClose}
				/>
			) : null}
		</div>
    );
}

export default Home;
