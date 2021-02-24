import React, { useEffect, useState } from 'react';
import {
	Typography,
	makeStyles,
	AppBar,
	Toolbar,
	IconButton,
	Button,
} from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import routes from '../../commons/routes';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
}));

function PackageDetailHeader({ packageName, updatable, localPackageData }) {
	const classes = useStyles();
	const history = useHistory();

	const [uninstallPromptShowed, setUninstallPromptShowed] = useState(false);

	const goBack = ev => {
		history.push(routes.HOME);
	};

	useEffect(() => {
		if (!uninstallPromptShowed) {
		
			ipcRenderer.on(
				'UNINSTALL_MESSAGE',
				function (ev, uninstallMessage) {
					window.alert(uninstallMessage);
					goBack();
				},
			);

			setUninstallPromptShowed(true);
		}
	}, []);


	const uninstallPackage = () => {
		let requiredBy = localPackageData['required-by'];
		if (typeof requiredBy === 'undefined') requiredBy = '';

		let confirmUninstallMsg = `Do you want to uninstall ${packageName}?`;

		if (requiredBy) {
			confirmUninstallMsg += ` It is required by ${requiredBy}.`;
		}

		const confirmUninstall = window.confirm(confirmUninstallMsg);

		if (confirmUninstall) {
			ipcRenderer.invoke('PACKAGE_UNINSTALL', packageName);
		}
	};

	return (
		<header className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						onClick={goBack}
					>
						<ArrowBackOutlined />
					</IconButton>
					<Typography className={classes.title} variant="h5" noWrap>
						{packageName}
					</Typography>

					{updatable ? (
						<Button
							variant="contained"
							color="secondary"
							style={{ margin: '0 7px' }}
						>
							Update
						</Button>
					) : null}

					<Button
						variant="contained"
						color="secondary"
						style={{ margin: '0 7px' }}
						onClick={uninstallPackage}
					>
						Remove
					</Button>
				</Toolbar>
			</AppBar>
		</header>
	);
}

export default PackageDetailHeader;
