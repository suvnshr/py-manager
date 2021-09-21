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
} from '@material-ui/core';
import { PIPContext } from '../context/PIPContext';
import Root from '../commons/Root';
import Home from './Home';
import FullScreenLoader from '../commons/FullScreenLoader';
const { ipcRenderer } = window.require('electron');

function HomeOrOnboarding() {
	const [onBoardingFailed, setOnBoardingFailed] = useState(false);
	const { hasOnBoarded } = useContext(PIPContext);

	
	useEffect(() => {
		ipcRenderer.on('ON_BOARDING_FAILED', () => {
		
			// on boarding failed
			setOnBoardingFailed(true);
		});
	}, []);

	// If onBoarding status is not yet updated then show loader
	if (hasOnBoarded === null) return <FullScreenLoader />;

	// if user has already on boarded
	else if (hasOnBoarded) {

		return (
			<Root>
				<Home />
			</Root>
		);
	} 
	
	// If user has not onboarded then start onBoarding and show the onBoarding status 
	else {
		return (
			<Dialog open>
				<DialogTitle>{onBoardingFailed ? "pip not found" : "Setting up..." }</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{onBoardingFailed ? (
							<div>On Boarding Failed. Please install pip on your machine</div>
						) : (
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
						)}
					</DialogContentText>
				</DialogContent>
			</Dialog>
		);
	}
}

export default HomeOrOnboarding;
