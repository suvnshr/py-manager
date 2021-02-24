import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, LinearProgress } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import routes from '../../commons/routes';

const useStyles = makeStyles(theme => ({
	root: {
		padding: 10,
	},
	card: {
		borderRadius: 12,
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
	pos: {
		marginBottom: 12,
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
		axios
			.get(`https://pypi.org/pypi/${packageName}/json`, {})
			.then(res => {
				setPackageData(res.data);
			})
			.catch(err => {
				setPackageData(-1);
			});
	}, []);

	const loader = (
		<Grid container justify="center">
			<Grid item xs={12}>
				<LinearProgress color="secondary" />
			</Grid>
		</Grid>
	);

	const goToDetailPage = ev => {
		history.push(
			routes.PACKAGE_DETAIL + packageName
		);
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
					<Typography className={classes.pos} color="textSecondary">
						{packageVersion}
					</Typography>
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
					>
						More
					</Button>
				</CardActions>
			</Card>
		</div>
	);
}
