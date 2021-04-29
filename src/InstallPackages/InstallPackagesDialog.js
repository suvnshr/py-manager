import React, { useState, useEffect } from 'react';
import { SearchOutlined, Close, Search, FilterList } from '@material-ui/icons';

import {
	CircularProgress,
	Container,
	Divider,
	Grid,
	InputAdornment,
	TextField,
	List,
	Dialog,
	Button,
	makeStyles,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	Chip,
} from '@material-ui/core';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { isNotEmpty, SlideDialogTransition } from '../commons/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import PackageSearchItem from './PackageSearchItem';
import InstallConfirmDialog from './InstallConfirmDialog';
import LazyLoadWrapper from '../commons/LazyLoadWrapper';

const { ipcRenderer } = window.require('electron');

const Schema = yup.object().shape({
	packageQuery: yup.string().required('Enter a package name'),
});

const useStyles = makeStyles(theme => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

const filterOptions = ['Relevance', 'Trending', 'Recent'];
export default function InstallPackagesDialog({
	isOpen,
	installedPackages,
	handleClose,
	setOpenInstallStatusModal,
}) {
	const classes = useStyles();

	// Search data
	const [searchedPackages, setSearchedPackages] = useState(null);

	// Search filter
	const [filter, setFilter] = useState(filterOptions[0]);

	// set to `true` when search request is sent to electron
	// set to `false` initially and after search data is received from electron
	const [packageLoading, setPackageLoading] = useState(false);

	// Contains the packages selected by user for installation
	const [packagesToInstall, setPackagesToInstall] = useState([]);

	// Whether `InstallConfirmDialog` is open or not
	const [confirmInstall, setConfirmInstall] = useState(false);

	// Show search results when search data is received from electron
	useEffect(() => {
		ipcRenderer.on('SEARCH_DATA', function (ev, matchedPackages) {
			setSearchedPackages(matchedPackages);
			setPackageLoading(false);
		});
	}, []);

	// `react-hook-form` initialization options
	const { register, handleSubmit, errors, getValues } = useForm({
		resolver: yupResolver(Schema),
		criteriaMode: 'firstError',
		mode: 'onSubmit',
		reValidateMode: 'onChange',
	});

	// Opens the `InstallConfirmDialog`
	const showInstallConfirmDialog = ev => {
		setConfirmInstall(true);
	};

	// Closes the `InstallConfirmDialog`
	const handleConfirmInstallClose = ev => {
		setConfirmInstall(false);
	};

	const handleFilterChange = ev => {
		setFilter(ev.target.value);
	};

	// Request electron to search `pypi.org`
	const formSubmit = formData => {
		const { packageQuery } = formData;

		if (packageQuery) {
			setPackageLoading(true);
			ipcRenderer.invoke('SEARCH_ONLINE', packageQuery, filter);
		}
	};

	useEffect(() => {
		formSubmit(getValues(['packageQuery']));
	}, [filter]);

	// Generates components to be shown to represent the search results
	// ...and the current state of the search operation.
	const renderSearchResults = () => {
		if (packageLoading) {
			return (
				<Grid container justify="center" style={{ height: '80vh' }}>
					<CircularProgress />
				</Grid>
			);
		} else if (searchedPackages !== null) {
			if (searchedPackages === -1) {
				return (
					<Typography align="center">
						Error occurred while searching.
					</Typography>
				);
			}

			if (Object.keys(searchedPackages).length === 0) {
				return (
					<Typography align="center"> No packages found</Typography>
				);
			}

			const listItems = Object.keys(searchedPackages).map(
				(packageName, index) => (
					<PackageSearchItem
						key={`package-search-item-${index}`}
						packageData={searchedPackages[packageName]}
						{...{
							packageName,
							packagesToInstall,
							setPackagesToInstall,
							installedPackages,
						}}
					/>
				),
			);

			return (
				<div>
					<p />
					<Divider />
					<p />

					<Grid container justify="space-between" alignItems="center">
						<Grid item>
							<FormControl>
								<InputLabel>Order By</InputLabel>
								<Select
									value={filter}
									onChange={handleFilterChange}
								>
									{filterOptions.map((filterItem, index) => (
										<MenuItem
											key={`select-${filterItem}-${index}`}
											value={filterItem}
										>
											{filterItem}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item>
							<Chip
								label={`${
									Object.keys(searchedPackages).length
								} packages
								found`}
							/>
						</Grid>
					</Grid>
					<p />

					{/* Search results */}
					<List>{listItems}</List>
				</div>
			);
		}
	};

	return (
		<div>
			<Dialog
				fullScreen
				open={isOpen}
				onClose={handleClose}
				TransitionComponent={SlideDialogTransition}
				disableBackdropClick={true}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<Close />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Install Packages
						</Typography>

						<Button
							autoFocus
							variant="contained"
							color="secondary"
							onClick={showInstallConfirmDialog}
							disabled={!Boolean(packagesToInstall.length)}
						>
							Install
							{packagesToInstall.length !== 0
								? ` (${packagesToInstall.length})`
								: null}
						</Button>
					</Toolbar>
				</AppBar>

				<p />
				<Container>
					<Grid container>
						<Grid item lg={3} xl={4} />
						<Grid item xs={12} lg={6} xl={4}>
							<form
								onSubmit={handleSubmit(formSubmit)}
								method="POST"
							>
								<TextField
									fullWidth={true}
									label="Install Packages"
									variant="outlined"
									name="packageQuery"
									inputRef={register}
									error={isNotEmpty(errors.packageQuery)}
									helperText={
										errors.packageQuery &&
										errors.packageQuery.message
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchOutlined color="primary" />
											</InputAdornment>
										),
									}}
								/>

								<p />
								<Grid container justify="flex-end">
									<Button
										type="submit"
										variant="contained"
										color="secondary"
										startIcon={<Search />}
									>
										Search
									</Button>
								</Grid>
							</form>

							{/* Search Results */}

							<List>{renderSearchResults()}</List>
						</Grid>
					</Grid>
				</Container>
				<InstallConfirmDialog
					open={confirmInstall}
					{...{
						packagesToInstall,
						setPackagesToInstall,
						handleConfirmInstallClose,
						handlePackageModalClose: handleClose,
						setOpenInstallStatusModal,
						setSearchedPackages,
					}}
				/>
			</Dialog>
		</div>
	);
}
