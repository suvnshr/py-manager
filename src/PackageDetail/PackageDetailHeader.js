import React, { useEffect } from 'react';
import { Typography, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ArrowBackOutlined } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import routes from '../commons/routes';
import theme from '../commons/theme';

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

	const goBack = ev => {
		history.push(routes.HOME);
	};

	useEffect(() => {
		let uninstallPromptShowed = false;

		if (!uninstallPromptShowed) {
			ipcRenderer.once(
				'UNINSTALL_MESSAGE',
				function (ev, uninstallMessage) {
					window.alert(uninstallMessage);
					uninstallPromptShowed = true;
					goBack();
				},
			);
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
                        size="large">
						<ArrowBackOutlined />
					</IconButton>
					<Typography className={classes.title} variant="h5" noWrap>
						About <b>{packageName}</b>
					</Typography>

					{/* {updatable ? (
						<Button
							variant="contained"
							color="secondary"
							style={{ margin: '0 7px' }}
						>
							Update
						</Button>
					) : null} */}

					<Button
						variant="contained"
						style={{
							margin: '0 7px',
							backgroundColor: theme.palette.error.dark,
							color: theme.palette.getContrastText(
								theme.palette.error.dark,
							),
						}}
						onClick={uninstallPackage}
						size="small"
					>
						Remove
					</Button>
				</Toolbar>
			</AppBar>
		</header>
    );
}

export default PackageDetailHeader;
