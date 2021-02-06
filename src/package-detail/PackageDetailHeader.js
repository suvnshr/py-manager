import React from 'react';
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
import routes from '../commons/routes';

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

function PackageDetailHeader({packageName, updatable}) {
	const classes = useStyles();
	const history = useHistory();

	const goBack = ev => {
		history.push(routes.HOME);
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
					>
						Remove
					</Button>
				</Toolbar>
			</AppBar>
		</header>
	);
}

export default PackageDetailHeader;
