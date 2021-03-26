import React, { createContext, useState, useEffect } from 'react';

const { ipcRenderer } = window.require('electron');

const PIPContext = createContext();

function PIPContentProvider(props) {
	const [allPIPS, setAllPIPS] = useState(null);
	const [currentPIP, setCurrentPIP] = useState(null);
	const [defaultPIP, setDefaultPIP] = useState(null);
	const [PIPContextLoaded, setPIPContextLoaded] = useState(false);

	const [hasOnBoarded, setHasOnBoarded] = useState(null);

	const [packages, setPackages] = useState(null);

	useEffect(() => {
		if (hasOnBoarded === null) {
			// Request `hasOnBoarded` status from electron
			ipcRenderer.invoke('GET_HAS_ON_BOARDED');

			ipcRenderer.on(
				'HAS_ON_BOARDED_RESULTS',
				function (ev, _hasOnBoarded) {
					// Receive hasOnBoarded from electron and set state
					setHasOnBoarded(_hasOnBoarded);
				},
			);
		}

		ipcRenderer.on('SEND_PACKAGES', function (ev, packagesData) {
			// console.log('Received packages');
			setPackages(packagesData);
		});
	}, []);

	useEffect(() => {
		if (hasOnBoarded === false) {
			// Start on boarding process if the user has not onboarded yet
			ipcRenderer.invoke('START_ON_BOARDING');
		}

		// Fetch PIP details after Onboarding status is received
		// because if the app has not onboarded yet and the `defaultPIP` is not set in
		// the `electron-store`
		// then `currentPIP` will be null, because with no extra PIP added, `currentPIP` points to the default PIP
		// and `defaultPIP` is set to `null` when onBoarding is not performed
		if (hasOnBoarded === true) {
			// Only set `currentPIP` once
			if (currentPIP === null) {
				// Request `currentPIP` from electron
				ipcRenderer.invoke('GET_CURRENT_PIP');

				ipcRenderer.on(
					'CURRENT_PIP_RESULTS',
					function (ev, _currentPIP) {
						// Receive `currentPIP` from electron and set state
						setCurrentPIP(_currentPIP);
					},
				);
			}

			// Only set `allPIPS` once
			if (allPIPS === null) {
				// Request `ALL_PIPS` from electron
				ipcRenderer.invoke('GET_ALL_PIPS');

				ipcRenderer.on('ALL_PIPS_RESULTS', function (ev, _allPIPS) {
					// Receive `allPIPS` from electron and set state
					setAllPIPS(_allPIPS);
				});
			}

			// Only set `defaultPIP` once
			if (defaultPIP === null) {
				// Request `DEFAULT_PIP` from electron
				ipcRenderer.invoke('GET_DEFAULT_PIP');

				ipcRenderer.on(
					'DEFAULT_PIP_RESULTS',
					function (ev, _defaultPIP) {
						setDefaultPIP(_defaultPIP);
					},
				);
			}
		}
	}, [hasOnBoarded]);

	useEffect(() => {
		if (currentPIP !== null && allPIPS !== null && defaultPIP !== null) {
			setPIPContextLoaded(true);
		}
	}, [currentPIP, allPIPS, defaultPIP]);

	return (
		<PIPContext.Provider
			value={{
				currentPIP,
				allPIPS,
				defaultPIP,
				PIPContextLoaded,
				packages,
				hasOnBoarded,
			}}
		>
			{props.children}
		</PIPContext.Provider>
	);
}

export { PIPContentProvider, PIPContext };
