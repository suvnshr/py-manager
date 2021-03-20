import React, { createContext, useState, useEffect } from 'react';

const { ipcRenderer } = window.require('electron');

const PIPContext = createContext();

function PIPContentProvider(props) {
	const [allPIPS, setAllPIPS] = useState(null);
	const [currentPIP, setCurrentPIP] = useState(null);
	const [defaultPIP, setDefaultPIP] = useState(null);
	const [PIPContextLoaded, setPIPContextLoaded] = useState(false);

	const [packages, setPackages] = useState(null);

	useEffect(() => {
		// Only set `currentPIP` once
		if (currentPIP === null) {
			// Request `currentPIP` from electron
			ipcRenderer.invoke('GET_CURRENT_PIP');

			ipcRenderer.on('CURRENT_PIP_RESULTS', function (ev, _currentPIP) {
				// Receive `currentPIP` from electron and set state
				setCurrentPIP(_currentPIP);
			});
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

			ipcRenderer.on('DEFAULT_PIP_RESULTS', function (ev, _defaultPIP) {
				setDefaultPIP(_defaultPIP);
			});
		}

		ipcRenderer.on('SEND_PACKAGES', function (ev, packagesData) {
			// console.log('Received packages');
			setPackages(packagesData);
		});
	}, []);

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
			}}
		>
			{props.children}
		</PIPContext.Provider>
	);
}

export { PIPContentProvider, PIPContext };
