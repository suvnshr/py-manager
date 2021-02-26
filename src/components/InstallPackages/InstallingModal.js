import React, { useEffect, useState } from 'react';

import {
	AppBar,
	Avatar,
	Box,
	Dialog,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	makeStyles,
	Paper,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

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
	},
}));

export default function InstallPackagesStatus({ isOpen, handleClose }) {
	const classes = useStyles();
	const [installOutput, setInstallOutput] = useState('');
	const [packageNameMessage, setPackageNameMessage] = useState({});

	useEffect(() => {
		ipcRenderer.on('INSTALL_OUTPUT', function (ev, installOutput) {
			setInstallOutput(installOutput);
		});

		ipcRenderer.on(
			'PACKAGE_STATUS_AFTER_INSTALL',
			function (ev, packageName, packageMessage,error) {
				let _packageNameMessage = { ...packageNameMessage };
				_packageNameMessage[packageName] = {packageMessage, error};
				setPackageNameMessage(_packageNameMessage);
			},
		);
	}, []);

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
					</Toolbar>
				</AppBar>

				<Grid container direction="column">
					<Grid item>
						<Box height="50vh">
							<Paper elevation={5}>
								<List className={classes.root}>
									{Object.entries(packageNameMessage).map(([packageName,packageMessage]) => (
										
									<ListItem>
										<ListItemAvatar>
											<Avatar>
												<CheckCircleOutlineIcon />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={packageName}
											secondary={packageMessage}
										/>
									</ListItem>
									))}
									
								</List>
							</Paper>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box className={classes.pre} height="50vh" width="100%">
							<pre>{installOutput}</pre>
						</Box>
					</Grid>
				</Grid>
			</Dialog>
		</div>
	);
}
