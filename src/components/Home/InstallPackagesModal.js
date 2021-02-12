import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { SearchOutlined } from '@material-ui/icons';

import {
	CircularProgress,
	Container,
	Divider,
	Grid,
	InputAdornment,
	ListItemIcon,
	TextField,
} from '@material-ui/core';

import { FaPython } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { isNotEmpty } from '../../commons/helpers';
import { yupResolver } from '@hookform/resolvers/yup';

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

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function InstallPackagesModal({ isOpen, handleClose }) {
	const classes = useStyles();
	const [searchedPackages, setSearchedPackages] = useState(null);
	const [packageLoading, setPackageLoading] = useState(false);

	useEffect(() => {
		ipcRenderer.on('SEARCH_DATA', function (ev, matchedPackages) {
			console.log(matchedPackages);
			setSearchedPackages(matchedPackages);
			setPackageLoading(false);
		});
	}, []);

	const formSubmit = formData => {
		console.log(formData);

		const { packageQuery } = formData;

		setPackageLoading(true);

		if (packageQuery) {
			ipcRenderer.invoke('SEARCH_ONLINE', packageQuery);
		}
	};

	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(Schema),
		criteriaMode: 'firstError',
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});

	const makeContent = () => {
		if (packageLoading) {
			return (
				<Grid container justify="center" style={{ height: '80vh' }}>
					<CircularProgress />
				</Grid>
			);
		} else if (searchedPackages !== null) {

			if(searchedPackages === -1) {
				return <div>Error occurred while searching.</div>
			}

			if (Object.keys(searchedPackages) === 0) {
				return <div> No packages found</div>;
			}

			const listItems = Object.keys(searchedPackages).map(
				(packageName, index) => (
					<ListItem divider={true} button key={`package-search-item-${index}`}>
						<ListItemIcon>
							<FaPython fontSize={24} />
						</ListItemIcon>
						<ListItemText
							primary={packageName}
							secondary={searchedPackages[packageName]}
						/>
					</ListItem>
				),
			);

			return (
				<div>
					<p />
					<Divider />
					<p />

					<Typography align="right" variant="subtitle2">
						{Object.keys(searchedPackages).length} packages found
					</Typography>
					<p />

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
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Install Packages
						</Typography>
						<Button autoFocus color="inherit" onClick={handleClose}>
							Install
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
									>
										Search packages
									</Button>
								</Grid>
							</form>

							{/* Search Results */}

							<List>{makeContent()}</List>
						</Grid>
					</Grid>
				</Container>
			</Dialog>
		</div>
	);
}
