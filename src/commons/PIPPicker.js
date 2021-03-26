import { Button, makeStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import React from 'react';
import { FaPython } from 'react-icons/fa';

const useStyles = makeStyles(theme => ({
	root: { 
        flex: 1 
    },
	pipSelectButton: {
		marginLeft: 15,
		padding: 10,
		fontSize: '1.15em',
		textTransform: 'none',
	},
}));

function PIPPicker({
	currentPIP,
	handlePIPSelectOpen,
	allowPicking = true,
	outlined = false,
}) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Button
				className={classes.pipSelectButton}
				onClick={handlePIPSelectOpen}
				variant={outlined ? 'outlined' : 'text'}
				startIcon={<FaPython size="0.9em" />}
				endIcon={allowPicking ? <ArrowDropDown /> : null}
			>
				{currentPIP.pipName}
			</Button>
		</div>
	);
}

export default PIPPicker;
