import React, { useEffect, useState  } from 'react';

import {
    AppBar,
    Avatar,
    Box,
    Button,
    Dialog,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Toolbar,
    Typography,
    Chip,
    ListItemSecondaryAction,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { green, red } from '@mui/material/colors';
import { Cancel, CheckOutlined, GetApp } from '@mui/icons-material';

import { SlideDialogTransition } from '../commons/helpers';
import PIPPicker from '../commons/PIPPicker';
import FullScreenLoader from '../commons/FullScreenLoader';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({
	appBar: {
		position: 'relative',
	},
	title: {
		// marginLeft: theme.spacing(2),
		// flex: 1,
	},
	pre: {
		background: '#1e1e1e',
		padding: theme.spacing(2),
		fontSize: 16,
		overflowY: 'auto',
	},
}));

const INSTALLING_TITLE = 'Installing Packages...';
const INSTALLED_TITLE = 'Installation Complete';

export default function InstallPackagesStatus({
	isOpen,
	handleClose,
	currentPIP,
}) {
	const classes = useStyles();
	const [dialogTitle, setDialogTitle] = useState(INSTALLING_TITLE);
	const [installOutput, setInstallOutput] = useState(null);
	const [packagesInstallStatus, setPackagesInstallStatus] = useState([]);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		ipcRenderer.on('INSTALL_OUTPUT', function (ev, installOutput) {
			setInstallOutput(installOutput);
		});

		ipcRenderer.on(
			'PACKAGE_STATUS_AFTER_INSTALL',
			function (ev, packagesInstallStatusFromElectron) {
				setPackagesInstallStatus(packagesInstallStatusFromElectron);
			},
		);
	}, []);

	useEffect(() => {
		if (
			installOutput !== null &&
			Object.keys(packagesInstallStatus).length === 0
		) {
			setLoading(false);
			setDialogTitle(INSTALLED_TITLE);
		}
	}, [installOutput, packagesInstallStatus]);

	useEffect(() => {
		const installationOutput = document.querySelector(
			'#installation-output',
		);

		if (installOutput !== null && installationOutput !== null) {
			installationOutput.scrollTop = installationOutput.scrollHeight;
		}
	}, [installOutput]);

	const goToHome = () => {
		handleClose();
		setLoading(true);
		setInstallOutput(null);
		// window.location.reload();
	};

	return (
        <div>
			<Dialog
                fullScreen
                open={isOpen}
                onClose={handleClose}
                TransitionComponent={SlideDialogTransition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" color="inherit" aria-label="close" size="large">
							<GetApp />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							{dialogTitle}
						</Typography>
						<PIPPicker
							currentPIP={currentPIP}
							allowPicking={false}
							outlined={true}
						/>
						{!loading ? (
							<Button
								autoFocus
								variant="contained"
								color="secondary"
								onClick={goToHome}
							>
								Done
							</Button>
						) : null}
					</Toolbar>
				</AppBar>

				{loading ? (
					<FullScreenLoader />
				) : (
					<div>
						<Grid container>
							<Grid item xs={2} />
							<Grid item xs={8}>
								<p />
								<Typography variant="h6">
									Installed packages
								</Typography>
								<Box
									height="38vh"
									style={{ overflowX: 'auto' }}
								>
									<List>
										{Object.entries(
											packagesInstallStatus,
										).map(
											(
												[
													packageName,
													packageStatusData,
												],
												index,
											) => (
												<ListItem
													divider
													key={`install-status-list-item-${index}`}
												>
													<ListItemAvatar>
														<Avatar
															style={{
																backgroundColor: packageStatusData.error
																	? red[300]
																	: green[300],
															}}
														>
															{packageStatusData.error ? (
																<Cancel />
															) : (
																<CheckOutlined />
															)}
														</Avatar>
													</ListItemAvatar>
													<ListItemText
														primary={packageName}
														secondary={
															packageStatusData.message
														}
													/>
													<ListItemSecondaryAction>
														<Chip
															// color="primary"
															size="small"
															label={
																packageStatusData.packageVersion
															}
														/>
													</ListItemSecondaryAction>
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
								<p>
									<Typography
										variant="body1"
										component="span"
									>
										Installation output:
									</Typography>
								</p>
								<Box
									className={classes.pre}
									height="38vh"
									id="installation-output"
								>
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
