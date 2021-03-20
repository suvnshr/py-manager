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
import PIPAdditionModal from '../components/Home/PIPAdditionModal';
import { PIPContext } from '../context/PIPContext';
import PIPSelectModal from '../components/Home/PIPSelectModal';

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
}));

function Header({}) {
	const classes = useStyles();

	const { currentPIP, PIPContextLoaded } = useContext(PIPContext);
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
					<ButtonBase className={classes.title} variant="h5" noWrap>
						PyManager
					</ButtonBase>

					{PIPContextLoaded ? (
						<Button
							className={classes.pipSelectButton}
							onClick={handlePIPSelectOpen}
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

			<PIPSelectModal
				open={pipSelectModalOpen}
				handleClose={handlePIPSelectClose}
			/>
		</header>
	);
}

export default Header;
