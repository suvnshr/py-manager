import React from 'react';
import Slide from '@mui/material/Slide';

const Margin = (count = 1) => <div style={{ margin: `${count * 16} 0` }} />;

/**
 * returns true if an object is "not" empty
 * else it returns false
 * @param {Object} obj The object to be tested
 */
const isNotEmpty = obj => {
	return typeof obj === 'undefined' || obj === null
		? false
		: Boolean(Object.keys(obj).length);
};

const isPackageInstalled = (packageName, installedPackages) => {
	return (
		installedPackages.findIndex(
			packageData => packageData.name === packageName,
		) !== -1
	);
};

const SlideDialogTransition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export { isNotEmpty, isPackageInstalled, SlideDialogTransition, Margin };
