import { CircularProgress, Grid } from '@material-ui/core';
import React from 'react';

function FullScreenLoader() {
	return (
		<Grid
			container
			justify="center"
			alignContent="center"
			style={{ height: '80vh' }}
		>
			<CircularProgress color="primary" />
		</Grid>
	);
}

export default FullScreenLoader;
