import React, { useContext, useState, useEffect } from 'react';
import {
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	LinearProgress,
} from '@mui/material';
import { PIPContext } from '../context/PIPContext';
import Root from '../commons/Root';
import Home from './Home';
import FullScreenLoader from '../commons/FullScreenLoader';

function HomeOrOnboarding() {
	const { hasOnBoarded, isDefaultPIPWorking } = useContext(PIPContext);

	// if (true) return <div> <p /> Has on boarded: {hasOnBoarded === null ? "null" : hasOnBoarded.toString()} </div>


	if (!hasOnBoarded && isDefaultPIPWorking !== false) {
		return (
			<Dialog open>
				<DialogTitle>Setting up...</DialogTitle>
				<DialogContent>
					<DialogContentText>

						<div>
							PyManager is currently finding default pip
							locations on your computer
							<p />
							<p />
							<LinearProgress
								variant="indeterminate"
								color="secondary"
							/>
						</div>

					</DialogContentText>
				</DialogContent>
			</Dialog>
		);
	}

	else if (hasOnBoarded && isDefaultPIPWorking === null) return <FullScreenLoader />;

	else if (hasOnBoarded && isDefaultPIPWorking) {

		return (
			<Root>
				<Home />
			</Root>
		);
	}

	else if(isDefaultPIPWorking === false) {
		return (
			<Dialog open>
				<DialogTitle>pip not found</DialogTitle>
				<DialogContent>
					<DialogContentText>
						On Boarding Failed. Please install pip on your machine
					</DialogContentText>
				</DialogContent>
			</Dialog>
		);
	}
}

export default HomeOrOnboarding;
