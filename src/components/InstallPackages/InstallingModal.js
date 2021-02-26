import React, { useEffect, useState } from 'react';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { Cancel, CheckOutlined, GetApp } from '@material-ui/icons';

import { SlideDialogTransition } from '../../commons/helpers';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	pre: {
		background: '#1e1e1e',
		padding: theme.spacing(2),
		fontSize: 16,
		overflowY: 'scroll',
	},
}));

export default function InstallPackagesStatus({ isOpen, handleClose }) {
	const classes = useStyles();
	const [installOutput, setInstallOutput] = useState(null);
	const [packageNameMessage, setPackageNameMessage] = useState({});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		ipcRenderer.on('INSTALL_OUTPUT', function (ev, installOutput) {
			setInstallOutput(installOutput);
		});

		ipcRenderer.on(
			'PACKAGE_STATUS_AFTER_INSTALL',
			function (ev, packageName, packageMessage, error) {
				let _packageNameMessage = { ...packageNameMessage};
				_packageNameMessage[packageName] = { packageMessage, error };
				console.log(packageName, packageMessage, error);
				setPackageNameMessage(_packageNameMessage);
			},
		);
	}, []);

	useEffect(() => {
		if (
			installOutput !== null &&
			Object.keys(packageNameMessage).length === 0
		) {
			setLoading(false);
		}
	}, [installOutput, packageNameMessage]);

	const loader = (
		<Grid
			container
			justify="center"
			alignContent="center"
			style={{ height: '100vh',  }}
		>
			<CircularProgress size={40} />
		</Grid>
	);

	return (
		<div>
			<Dialog
				fullScreen
				open={isOpen}
				onClose={handleClose}
				TransitionComponent={SlideDialogTransition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="close"
						>
							<GetApp />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Installing Packages
						</Typography>

						<Button autoFocus variant="contained" color="secondary">
							Done
						</Button>
					</Toolbar>
				</AppBar>

				{loading ? (
					loader
				) : (
					<div>
						<Grid container>
							<Grid item xs={2} />
							<Grid item xs={8}>
								<Box height="48vh">
									<List>
										{Object.entries(packageNameMessage).map(
											([
												packageName,
												packageInstallData,
											], index) => (
												<ListItem divider key={`install-status-list-item-${index}`}>
													<ListItemAvatar>
														<Avatar
															style={{
																backgroundColor: packageInstallData.error
																	? red[300]
																	: green[300],
															}}
														>
															{packageInstallData.error ? (
																<Cancel />
															) : (
																<CheckOutlined />
															)}
														</Avatar>
													</ListItemAvatar>
													<ListItemText
														primary={packageName}
														secondary={
															packageInstallData.packageMessage
														}
													/>
												</ListItem>
											),
										)}
									</List>
								</Box>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={2} />
							<Grid item xs={8}>
								<Typography variant="subtitle">
									Output:
								</Typography>
								<Box className={classes.pre} height="48vh">
									<pre
										style={{
											whiteSpace: 'break-spaces',
											wordBreak: 'break-word',
										}}
									>
										{installOutput}
									</pre>
								</Box>
							</Grid>
						</Grid>
					</div>
				)}
			</Dialog>
		</div>
	);
}
