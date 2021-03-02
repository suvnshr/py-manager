import React from 'react'
import Slide from "@material-ui/core/Slide";

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

	let found = false

	installedPackages.forEach(_packageData => {
		if(_packageData.name == packageName) {
			found = true;
		}
	});
	
	return found;
	
};


const SlideDialogTransition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});


export { isNotEmpty, isPackageInstalled, SlideDialogTransition };