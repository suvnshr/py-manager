import React, { useEffect, useState, useContext } from 'react';

import { FaPython } from 'react-icons/fa';

import {
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	Grid,
	InputAdornment,
	ListItemIcon,
	MenuItem,
	TextField,
	Typography,
} from '@material-ui/core';
import {
	Add,
	Delete,
	GetApp,
	GetAppOutlined,
	SearchOutlined,
} from '@material-ui/icons';

import InstallPackagesStatus from '../InstallPackages/InstallingPackageStatus';
import InstallPackagesDialog from '../InstallPackages/InstallPackagesDialog';
import PIPAdditionModal from './PIPAdditionModal';
import PackageCard from './PackageCard';
import { PIPContext } from '../../context/PIPContext';

const { ipcRenderer } = window.require('electron');

const PIPS = ['main', '1234567890'];

function Home() {
	const [packages, setPackages] = useState(null);
	const [query, setQuery] = useState('');
	const [pipAdditionModalOpen, setPIPAdditionModalOpen] = useState(false);
	const [packageInstallModalOpen, setPackageInstallModalOpen] = useState(
		false,
	);

	const [openInstallStatusModal, setOpenInstallStatusModal] = useState(false);

	const { currentPIP, allPIPS } = useContext(PIPContext);

	const changeCurrentPIP = pipName => {
		if (pipName !== currentPIP.pipName) {
			ipcRenderer.invoke('CHANGE_CURRENT_PIP', pipName);
			window.location.reload();
		}
	};

	const handleInstallStatusClose = ev => {
		setOpenInstallStatusModal(false);
	};

	const handlePIPAdditionDialogClose = ev => {
		setPIPAdditionModalOpen(false);
	};

	const handlePackageInstallModalClose = ev => {
		setPackageInstallModalOpen(false);
	};

	const handlePackageInstall = ev => {
		setPackageInstallModalOpen(true);
	};

	useEffect(() => {
		console.log(currentPIP, allPIPS);
	}, [currentPIP, allPIPS]);

	useEffect(() => {
		ipcRenderer.invoke('RECEIVE_PACKAGES');

		ipcRenderer.on('SEND_PACKAGES', function (ev, packagesData) {
			setPackages(packagesData);
		});
	}, []);

	const handlePIPChange = ev => {
		const pipName = ev.target.value;
		if (pipName === null) handlePIPAddition(ev);
	};

	const handlePIPAddition = ev => {
		setPIPAdditionModalOpen(true);
	};

	const performSearch = ev => setQuery(ev.target.value.toLowerCase());

	const loader = <CircularProgress />;

	const smallLoader = <CircularProgress size={20} />;

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

							<Grid item>
								{currentPIP === null || allPIPS === null ? (
									smallLoader
								) : (
									<TextField
										select
										label="Current PIP"
										value={currentPIP.pipName}
										fullWidth={true}
										onChange={handlePIPChange}
										variant="outlined"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FaPython color="primary" />
												</InputAdornment>
											),
										}}
									>
										{Object.entries(allPIPS).map(
											([pipName, pipPath], index) => (
												<MenuItem
													onClick={ev =>
														changeCurrentPIP(
															pipName,
														)
													}
													key={`pip-menu-item-${index}`}
													value={pipName}
												>
													{pipName}
												</MenuItem>
											),
										)}

										<Divider light />

										<MenuItem value={null}>
											<ListItemIcon>
												<Add />
											</ListItemIcon>

											<Typography
												variant="inherit"
												align="center"
											>
												Add PIP
											</Typography>
										</MenuItem>
									</TextField>
								)}
							</Grid>
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
				<Grid container justify="space-between" style={{padding: 20}}>
					<Grid item>
						{packages !== null ? (
							<Chip
								component="span"
								variant="outlined"
								label={`${packages.length} packages installed`}
							/>
						) : null}
					</Grid>

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
				</Grid>

				<Grid container justify="center">
					{packages === null
						? loader
						: packages.length === 0
						? noResultsFound
						: packagesList()}
				</Grid>
			</Container>

			{/* Modals */}

			<PIPAdditionModal
				isOpen={pipAdditionModalOpen}
				handleClose={handlePIPAdditionDialogClose}
			/>

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
