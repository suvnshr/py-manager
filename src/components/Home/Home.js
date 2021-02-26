import React, { useState, useEffect } from 'react';
import {
	TextField,
	Grid,
	CircularProgress,
	Container,
	InputAdornment,
	MenuItem,
	Button,
	ListItemIcon,
	Typography,
	Divider,
} from '@material-ui/core';
// import eventNames from '../commons/eventNames';
import PackageCard from './PackageCard';
import EnvAdditionModal from './EnvAdditionModal';
import { Add, Pages, SearchOutlined } from '@material-ui/icons';
import { FaPython } from 'react-icons/fa';
import InstallPackagesDialog from '../InstallPackages/InstallPackagesDialog';
const { ipcRenderer } = window.require('electron');

const ENVS = ['main', '1234567890'];

function Home() {
	const [packages, setPackages] = useState(null);
	const [query, setQuery] = useState('');
	const [env, setEnv] = useState(ENVS[0]);
	const [envAdditionModalOpen, setEnvAdditionModalOpen] = useState(false);
	const [packageInstallModalOpen, setPackageInstallModalOpen] = useState(
		false,
	);

	const [openInstallStatusModal, setOpenInstallStatusModal] = useState(false);

	const handleEnvAdditionDialogClose = ev => {
		setEnvAdditionModalOpen(false);
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

	const handleEnvChange = ev => {
		const value = ev.target.value;

		if (value !== null) setEnv(ev.target.value);
		else handleEnvAddition(ev);
	};

	const handleEnvAddition = ev => {
		setEnvAdditionModalOpen(true);
	};
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
							<TextField
								select
								label="Env"
								value={env}
								fullWidth={true}
								onChange={handleEnvChange}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FaPython color="primary" />
										</InputAdornment>
									),
								}}
							>
								{ENVS.map((option, index) => (
									<MenuItem key={`env-menu-item-${index}`} value={option}>
										{option}
									</MenuItem>
								))}

								<Divider light />

								<MenuItem value={null}>
									<ListItemIcon>
										<Add />
									</ListItemIcon>

									<Typography
										variant="inherit"
										align="center"
									>
										Add Env
									</Typography>
								</MenuItem>
							</TextField>
						</Grid>
					</Grid>
					<p />
				</Grid>
			</Grid>

			<p />
			{packages !== null ? (
				<Grid justify="center" container>
					<Button
						variant="contained"
						color="secondary"
						onClick={handlePackageInstall}
					>
						Install Packages
					</Button>
				</Grid>
			) : null}

			<p />

			<Divider light />

			<Container>
				{packages !== null ? (
					<div style={{ padding: 10 }}>
						<Typography variant="subtitle1" align="left">
							{packages.length} packages installed
						</Typography>
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

			<EnvAdditionModal
				isOpen={envAdditionModalOpen}
				handleClose={handleEnvAdditionDialogClose}
			/>

			{/* Modal to install packages */}
			<InstallPackagesDialog
				isOpen={packageInstallModalOpen}
				installedPackages={packages}
				handleClose={handlePackageInstallModalClose}
				setOpenInstallStatusModal={setOpenInstallStatusModal}
			/>
		</div>
	);
}

export default Home;
