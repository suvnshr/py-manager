import React, { useEffect, useState } from 'react';


import {
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	Grid,
	InputAdornment,
	TextField,
} from '@material-ui/core';
import {
	GetApp,
	SearchOutlined,
} from '@material-ui/icons';

import InstallPackagesStatus from '../InstallPackages/InstallingPackageStatus';
import InstallPackagesDialog from '../InstallPackages/InstallPackagesDialog';
import PackageCard from './PackageCard';

const { ipcRenderer } = window.require('electron');


function Home() {
	const [packages, setPackages] = useState(null);
	const [query, setQuery] = useState('');
	const [packageInstallModalOpen, setPackageInstallModalOpen] = useState(
		false,
	);

	const [openInstallStatusModal, setOpenInstallStatusModal] = useState(false);

	const handleInstallStatusClose = ev => {
		setOpenInstallStatusModal(false);
	};

	

	const handlePackageInstallModalClose = ev => {
		setPackageInstallModalOpen(false);
	};

	const handlePackageInstall = ev => {
		setPackageInstallModalOpen(true);
	};

	useEffect(() => {
		ipcRenderer.invoke('RECEIVE_PACKAGES');

		ipcRenderer.on('SEND_PACKAGES', function (ev, packagesData) {
			setPackages(packagesData);
		});
	}, []);

	

	
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
				key={'package-card-' + index}
			>
				<PackageCard {...packageData} />
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
						<Grid container justify="center">
							<Grid item style={{ flex: 1 }}>
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

							
						</Grid>
						<p />
					</div>

					<p />
					{packages !== null ? (
						<Grid justify="center" container>
							<Button
								variant="contained"
								color="secondary"
								onClick={handlePackageInstall}
								startIcon={<GetApp />}
							>
								Install
							</Button>
						</Grid>
					) : null}

					<p />
				</Grid>
			</Grid>

			<Divider light />

			<Container>
				{packages !== null ? (
					<div style={{ padding: 5, textAlign: 'right' }}>
						<Chip
							component="span"
							label={`${packages.length} packages installed`}
						/>
					</div>
				) : null}

				<Grid container justify="center">
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

			<InstallPackagesStatus
				isOpen={openInstallStatusModal}
				handleClose={handleInstallStatusClose}
			/>
		</div>
	);
}

export default Home;
