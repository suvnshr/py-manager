import { CircularProgress, Grid } from '@mui/material';
import React from 'react';

function FullScreenLoader() {
	return (
        <Grid
			container
			justifyContent="center"
			alignContent="center"
			style={{ height: '80vh' }}
		>
			<CircularProgress color="primary" />
		</Grid>
    );
}

export default FullScreenLoader;
