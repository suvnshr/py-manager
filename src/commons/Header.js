import React, { useState, useContext } from 'react';
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
	Button,
} from '@material-ui/core';
import { FaPython } from 'react-icons/fa';

import { Add } from '@material-ui/icons';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PIPAdditionModal from '../components/Home/PIPAdditionModal';
import { PIPContext } from '../context/PIPContext';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	pipSelectButton: {
		marginLeft: 15,
		padding: 10,
		fontSize: '1.15em',
		textTransform: 'none',
	},
	title: {
		// flexGrow: 1,
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	arrowDropDownIcon: {
		marginLeft: 0,
	},
}));

function Header({}) {
	const classes = useStyles();

	const { currentPIP, allPIPS } = useContext(PIPContext);
	const [pipSelectModalOpen, setPIPSelectModalOpen] = useState(false);

	const handlePIPSelectOpen = ev => {
		setPIPSelectModalOpen(true);
	};

	const handlePIPSelectClose = ev => {
		setPIPSelectModalOpen(false);
	};

	return (
		<header className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography className={classes.title} variant="h5" noWrap>
						PyManager
					</Typography>

					{currentPIP !== null && allPIPS !== null ? (
						<Button
							className={classes.pipSelectButton}
							// variant="outlined"
							startIcon={<FaPython size="0.9em" />}
							endIcon={
								<ArrowDropDownIcon
									className={classes.arrowDropDownIcon}
								/>
							}
						>
							{currentPIP.pipName}
						</Button>
					) : null}
				</Toolbar>
			</AppBar>
		</header>
	);
}

export default Header;
