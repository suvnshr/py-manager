import React, { useState, useContext } from 'react';
import {
	Typography as ButtonBase,
	AppBar,
	Toolbar,
	IconButton,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PIPAdditionModal from '../Home/PIPAdditionModal';
import { PIPContext } from '../context/PIPContext';
import PIPSelectModal from '../Home/PIPSelectModal';
import PIPPicker from './PIPPicker';
import { InfoOutlined } from '@mui/icons-material';
import AboutUsDialog from '../Home/AboutUsDialog';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	titlePart: {
		'&::first-letter': {
			display: 'inline!important',
			color: theme.palette.secondary.main,
		},
	},
	title: {
		// flexGrow: 1,
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
		},
	},
}));

function Header() {
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

	const [aboutUsDialogOpen, setAboutUsDialogOpen] = React.useState(false);

	const openAboutUsDialog = () => {
		setAboutUsDialogOpen(true);
	};

	const closeAboutUsDialog = () => {
		setAboutUsDialogOpen(false);
	};

	return (
		<header className={classes.root}>
			<AppBar position="static" elevation={5}>
				<Toolbar>
					<ButtonBase
						className={classes.title}
						variant="h5"
						component="div"
						noWrap
					>
						<div
							style={{ marginRight: 4 }}
							className={classes.titlePart}
						>
							Py
						</div>
						<div className={classes.titlePart}>Manager</div>
					</ButtonBase>

					{PIPContextLoaded ? (
						<PIPPicker
							currentPIP={currentPIP}
							handlePIPSelectOpen={handlePIPSelectOpen}
						/>
					) : null}
					<IconButton
						size="large"
						edge="end"
						color="inherit"
						aria-label="menu"
						onClick={openAboutUsDialog}
					>
						<InfoOutlined />
					</IconButton>
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

			<AboutUsDialog
				open={aboutUsDialogOpen}
				handleAboutUsDialogClose={closeAboutUsDialog}
			/>
		</header>
	);
}

export default Header;
