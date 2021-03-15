import React, { createContext, useState, useEffect } from 'react';

const { ipcRenderer } = window.require('electron');

const PIPContext = createContext();

function PIPContentProvider(props) {
	const [currentPIP, setCurrentPIP] = useState(null);
	const [allPIPS, setAllPIPS] = useState(null);

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

		// Only set `ALL_PIPS` once
		if (allPIPS === null) {

			// Request `ALL_PIPS` from electron
			ipcRenderer.invoke('GET_ALL_PIPS');

			ipcRenderer.on('ALL_PIPS_RESULTS', function (ev, _allPIPS) {

				// Receive `allPIPS` from electron and set state
				setAllPIPS(_allPIPS);
			});
		}

    }, []);

	return (
		<PIPContext.Provider value={{ currentPIP, allPIPS }}>
			{props.children}
		</PIPContext.Provider>
	);
}

export { PIPContentProvider, PIPContext };
