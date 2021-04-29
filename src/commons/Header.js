import React, { useState, useContext } from 'react';
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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PIPAdditionModal from '../Home/PIPAdditionModal';
import { PIPContext } from '../context/PIPContext';
import PIPSelectModal from '../Home/PIPSelectModal';
import PIPPicker from './PIPPicker';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},

	title: {
		// flexGrow: 1,
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
}));

function Header({}) {
	const classes = useStyles();

	const { currentPIP, PIPContextLoaded } = useContext(PIPContext);
	const [pipSelectModalOpen, setPIPSelectModalOpen] = useState(false);
	const [pipAdditionModalOpen, setPIPAdditionModalOpen] = useState(false);

	const handlePIPAdditionDialogClose = ev => {
		setPIPAdditionModalOpen(false);
	};

	const handlePIPAddition = ev => {
		setPIPAdditionModalOpen(true);
	};

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
					<ButtonBase className={classes.title} variant="h5" noWrap>
						PyManager
					</ButtonBase>

					{PIPContextLoaded ? (
						<PIPPicker currentPIP={currentPIP} handlePIPSelectOpen={handlePIPSelectOpen} />
					) : null}
				</Toolbar>
			</AppBar>

			<PIPAdditionModal
				open={pipAdditionModalOpen}
				handleClose={handlePIPAdditionDialogClose}
			/>

			<PIPSelectModal
				open={pipSelectModalOpen}
				pipAdditionModalOpen={pipAdditionModalOpen}
				handleClose={handlePIPSelectClose}
				handlePIPAddition={handlePIPAddition}
				handlePIPAdditionDialogClose={handlePIPAdditionDialogClose}
			/>
		</header>
	);
}

export default Header;
