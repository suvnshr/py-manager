import React from 'react';

import {
	AppBar,
	Dialog,
	IconButton,
	makeStyles,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { SlideDialogTransition } from '../../commons/helpers';

const { ipcRenderer } = window.require('electron');


const useStyles = makeStyles(theme => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

export default function InstallPackagesModal({
	isOpen,
	handleClose,
}) {
	const classes = useStyles();

	return (
		<div>
			<Dialog
				fullScreen
				open={isOpen}
				onClose={handleClose}
				TransitionComponent={SlideDialogTransition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<Close />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Installing Packages
						</Typography>
					</Toolbar>
				</AppBar>

				<Grid
          container
          direction="column"
          alignItems="center"
        >
          <Grid item>
            <Box height="50vh">
              <h2>
                Packages Installing Status
              </h2>
            </Box>
          </Grid>
          <Grid item>
            <Box height="50vh">
              <h2>
                Packages Installing Message
              </h2>
            </Box>
          </Grid>
        </Grid>
				
			</Dialog>
		</div>
	);
}
