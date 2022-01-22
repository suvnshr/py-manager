import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider, Grid, LinearProgress } from '@mui/material';
import { useHistory } from 'react-router-dom';
import routes from '../commons/routes';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({
	root: {
		padding: 10,
	},
	card: {
		borderRadius: 12,
		borderBottomRightRadius: 40,
		// 	minWidth: 275,
		// 	backgroundImage: `linear-gradient(135deg,
		// 		${theme.palette.secondary.main},
		// 		${theme.palette.secondary.main}90 45%,
		// 		${theme.palette.secondary.main}80 50%,
		// 		${theme.palette.secondary.main}70)`,
	},
	content: {
		'display': '-webkit-box!important',
		'-webkit-line-clamp': 2,
		'-webkit-box-orient': 'vertical',
		'overflow': 'hidden',
		'height': 40,
	},
	title: {
		fontSize: 14,
	},
	packageVersion: {
		marginBottom: 16,
	},
	actions: {
		justifyContent: 'flex-end',
	},
}));

export default function PackageCard({
	name: packageName,
	version: packageVersion,
}) {
	const classes = useStyles();
	const history = useHistory();

	const [packageData, setPackageData] = useState(null);

	useEffect(() => {
		ipcRenderer.invoke('GET_PYPI_PACKAGE_DATA', packageName);

		ipcRenderer.once(
			'PYPI_PACKAGE_DATA_OF_' + packageName,
			(ev, _packageData) => setPackageData(_packageData),
		);
	}, []);

	const loader = (
		<Grid container justifyContent="center">
			<Grid item xs={12}>
				<LinearProgress color="secondary" />
			</Grid>
		</Grid>
	);

	const goToDetailPage = ev => {
		history.push(routes.PACKAGE_DETAIL + packageName);
	};

	return (
		<div className={classes.root}>
			<Card
				className={classes.card}
				variant="elevation"
				color="secondary"
			>
				<CardContent>
					{/* <Typography className={classes.title} color="textSecondary" gutterBottom></Typography> */}
					<Typography variant="h5" component="h2">
						{packageName}
					</Typography>
					<Typography
						className={classes.packageVersion}
						color="textSecondary"
					>
						{packageVersion}
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<Typography
						variant="body2"
						component="div"
						className={classes.content}
					>
						{packageData === null ? (
							loader
						) : packageData === -1 ||
						  packageData.info.summary.length === 0 ? (
							<i>No Description</i>
						) : (
							packageData.info.summary
						)}
					</Typography>
				</CardContent>
				<CardActions className={classes.actions}>
					<Button
						size="large"
						color="secondary"
						onClick={goToDetailPage}
						sx={{
							borderBottomRightRadius: 40,
						}}
					>
						More
					</Button>
				</CardActions>
			</Card>
		</div>
	);
}
