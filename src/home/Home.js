import React, { useState, useEffect } from 'react';
import {
	TextField,
	Grid,
	CircularProgress,
	Container,
	InputAdornment,
	MenuItem,
} from '@material-ui/core';
// import eventNames from '../commons/eventNames';
import PackageCard from './PackageCard';
import { SearchOutlined } from '@material-ui/icons';

import { FaPython } from 'react-icons/fa';

const { ipcRenderer } = window.require('electron');

const ENVS = ['main', '1234567890'];

function Home() {
	const [packages, setPackages] = useState(null);
	const [query, setQuery] = useState('');
	const [env, setEnv] = useState(ENVS[0]);

	useEffect(() => {
		ipcRenderer.invoke('RECEIVE_PACKAGES');

		ipcRenderer.on('SEND_PACKAGES', function (ev, packagesData) {
			setPackages(packagesData);
		});
	}, []);

	const handleEnvChange = ev => {
		setEnv(ev.target.value);
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
				<Grid item sm={3} md={4} lg={4} />
				<Grid item xs={12} sm={6} md={4} lg={4}>
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
								{ENVS.map(option => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					</Grid>
					<p />
				</Grid>
			</Grid>

			<p />

			<Container>
				<Grid container justify="center">
					{packages === null
						? loader
						: packages.length === 0
						? noResultsFound
						: packagesList()}
				</Grid>
			</Container>
		</div>
	);
}

export default Home;
