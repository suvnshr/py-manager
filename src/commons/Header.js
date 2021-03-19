import React, { useState } from 'react';
import {
	Typography,
	makeStyles,
	AppBar,
	Toolbar,
	TextField,
	MenuItem,
	Divider,
	ListItemIcon,
	InputAdornment,
} from '@material-ui/core';
import { FaPython } from 'react-icons/fa';

import { Add } from '@material-ui/icons';
import EnvAdditionModal from '../components/Home/EnvAdditionModal';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		// flexGrow: 1,
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	envSelect: {
		[theme.breakpoints.up('sm')]: {
			paddingTop: theme.spacing(0.5),
			marginLeft: theme.spacing(1.5),
		},
	},
}));

const ENVS = ['main', '1234567890'];

function Header({ showBack }) {
	const classes = useStyles();
	const [env, setEnv] = useState(ENVS[0]);
	const [envAdditionModalOpen, setEnvAdditionModalOpen] = useState(false);

	const handleEnvChange = ev => {
		const value = ev.target.value;

		if (value !== null) setEnv(ev.target.value);
		else handleEnvAddition(ev);
	};
	const handleEnvAddition = ev => {
		setEnvAdditionModalOpen(true);
	};
	const handleEnvAdditionDialogClose = ev => {
		setEnvAdditionModalOpen(false);
	};
	return (
		<header className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography className={classes.title} variant="h5" noWrap>
						PyManager
					</Typography>

					{/* <Grid item> */}
					<TextField
						select
						className={classes.envSelect}
						value={env}
						onChange={handleEnvChange}
						InputProps={{
							disableUnderline: true,
							startAdornment: (
								<InputAdornment position="start">
									<FaPython color="primary" />
								</InputAdornment>
							),
						}}
					>
						{ENVS.map((option, index) => (
							<MenuItem
								key={`env-menu-item-${index}`}
								value={option}
							>
								{option}
							</MenuItem>
						))}

						<Divider light />

						<MenuItem value={null}>
							<ListItemIcon>
								<Add />
							</ListItemIcon>

							<Typography variant="inherit" align="center">
								Add Env
							</Typography>
						</MenuItem>
					</TextField>
					{/* </Grid> */}
				</Toolbar>
			</AppBar>

			<EnvAdditionModal
				isOpen={envAdditionModalOpen}
				handleClose={handleEnvAdditionDialogClose}
			/>
		</header>
	);
}

export default Header;
