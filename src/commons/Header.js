import React, { useState } from 'react';

import {
	Typography as ButtonBase,
	makeStyles,
	AppBar,
	Toolbar,
	Button,
	Icon,
	TextField,
	MenuItem,
	Divider,
	ListItemIcon,
	InputAdornment,
	Dialog,
	withStyles,
	Radio,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Grid,
	List,
	ListItem,
} from '@material-ui/core';
import { FaPython } from 'react-icons/fa';

import { Add } from '@material-ui/icons';
import PIPAdditionModal from '../components/Home/PIPAdditionModal';
import PIPSelectModal from '../components/Home/PIPSelectModal';

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



function Header({ showBack }) {
	const classes = useStyles();
	const [envAdditionModalOpen, setEnvAdditionModalOpen] = useState(false);


	

	// const handleEnvChange = ev => {
	// 	const value = ev.target.value;

	// 	if (value !== null) setEnv(ev.target.value);
	// 	else handleEnvAddition(ev);
	// };

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
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
					<ButtonBase className={classes.title} variant="h5" noWrap>
						PyManager
					</ButtonBase>

					<Button
						className={classes.envSelect}
						endIcon={<Icon>arrow_downward</Icon>}
						onClick={handleClickOpen}
					>
						Select Env
					</Button>
					{/* <Grid item> */}
					{/* <TextField
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
					</TextField> */}
					{/* </Grid> */}
				</Toolbar>
			</AppBar>

			<PIPAdditionModal
				isOpen={envAdditionModalOpen}
				handleClose={handleEnvAdditionDialogClose}
			/>

			<PIPSelectModal 
				isOpen={open}
				handleClose={handleClose}
			/>
			
		</header>
	);
}

export default Header;
