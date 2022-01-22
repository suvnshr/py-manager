import {
	Chip,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import {
	LanguageRounded,
	MenuBookRounded,
	StorageRounded,
	SupervisedUserCircleRounded,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import routes from '../commons/routes';

import { Margin } from '../commons/helpers';

const packageProperties = {
	'author': <SupervisedUserCircleRounded />,
	'home-page': <LanguageRounded />,
	'license': <MenuBookRounded />,
	'location': <StorageRounded />,
};

const useStyles = makeStyles(theme => ({
	primaryText: {
		textTransform: 'capitalize',
	},
	packageTitle: {
		paddingBottom: 10,
	},
}));

function PackageDetailBody({
	localPackageData,
	packageData,
	packageName,
	setPackageData,
	setLocalPackageData,
}) {
	const history = useHistory();
	const classes = useStyles();

	const goToOtherPackage = packageName => {
		setPackageData(null);
		setLocalPackageData(null);

		history.push(routes.PACKAGE_DETAIL + packageName);
	};

	const packageDetail = _ => {
		let requiredBy = localPackageData['required-by'];
		let requires = localPackageData['requires'];

		requiredBy =
			typeof requiredBy === 'undefined' ? [''] : requiredBy.split(', ');
		requires =
			typeof requires === 'undefined' ? [''] : requires.split(', ');

		const description =
			packageData === -1 ? (
				localPackageData.summary ? (
					localPackageData.summary
				) : (
					<i>No Description</i>
				)
			) : (
				packageData.info.summary
			);

		return (
			<div>
				<p id="summary-section">{description}</p>

				<div id="info-section">
					<List>
						{Object.entries(packageProperties).map(
							([propertyName, propertyIcon], index) => (
								<ListItem
									dense={true}
									divider={true}
									alignItems="flex-start"
								>
									<ListItemIcon>{propertyIcon}</ListItemIcon>
									<ListItemText
										primary={propertyName}
										primaryTypographyProps={{
											className: classes.primaryText,
										}}
										secondary={
											localPackageData[propertyName]
										}
									/>
								</ListItem>
							),
						)}
					</List>
				</div>

				<div>
					{requiredBy[0].length > 0 ? (
						<div id="required-by-section">
							<Margin />

							<Typography variant="h5">Required By</Typography>
							<p style={{ paddingInline: "16px" }}>
								{requiredBy.map(packageName => (
									<Chip
										key={`required-by-${packageName}`}
										label={packageName}
										variant="outlined"
										color="secondary"
										component="span"
										style={{ margin: 5 }}
										onClick={() =>
											goToOtherPackage(packageName)
										}
									/>
								))}
							</p>
						</div>
					) : null}

					{requires[0].length > 0 ? (
						<div id="requires-section">
							<Typography variant="h5">Requires</Typography>
							<p style={{ paddingInline: "16px" }}>
								{requires.map(packageName => (
									<Chip
										key={`requires-${packageName}`}
										label={packageName}
										variant="outlined"
										component="span"
										onClick={() =>
											goToOtherPackage(packageName)
										}
										color="secondary"
										style={{ margin: 5 }}
									/>
								))}
							</p>
						</div>
					) : null}
				</div>
			</div>
		);
	};

	const content = _ => (
		<div>
			<p />
			<Grid container>
				<Grid item sm={2} md={3} lg={3} />

				<Grid item xs={12} sm={8} md={6} lg={6}>
					<Typography variant="h4" className={classes.packageTitle}>
						{packageName}
					</Typography>
					<Chip variant="outlined" label={localPackageData.version} />

					<div>{packageDetail()}</div>
				</Grid>
			</Grid>
		</div>
	);

	return content();
}
export default PackageDetailBody;
