import { Chip, Grid, Typography } from '@material-ui/core';
import React from 'react';
import {
	LanguageRounded,
	MenuBookRounded,
	StorageRounded,
	SupervisedUserCircleRounded,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import routes from '../commons/routes';

const packageProperties = {
	'author': <SupervisedUserCircleRounded />,
	'home-page': <LanguageRounded />,
	'license': <MenuBookRounded />,
	'location': <StorageRounded />,
};

function PackageDetailBody({
	localPackageData,
	packageData,
	packageName,
	setPackageData,
	setLocalPackageData,
}) {
	const history = useHistory();

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

				<p id="chip-section">
					{Object.entries(packageProperties).map(
						([propertyName, propertyIcon], index) => (
							<Chip
								key={`package-chip-${index}`}
								icon={propertyIcon}
								color="secondary"
								label={`${localPackageData[propertyName]}`}
								style={{ margin: 5 }}
								onClick={() => null}
							/>
						),
					)}
				</p>

				<div>
					{requiredBy[0].length > 0 ? (
						<div id="required-by-section">
							<Typography variant="h4">Required By</Typography>
							<p>
								{requiredBy.map(packageName => (
									<Chip
										label={packageName}
										color="secondary"
										style={{ margin: 5 }}
										onClick={() => goToOtherPackage(packageName)}
									/>
								))}
							</p>
						</div>
					) : null}

					{requires[0].length > 0 ? (
						<div id="requires-section">
							<Typography variant="h4">Requires</Typography>
							<p>
								{requires.map(packageName => (
									<Chip
										label={packageName}
										onClick={() => goToOtherPackage(packageName)}
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
					<Typography variant="h3">{packageName}</Typography>
					<Typography variant="subtitle1">
						v{localPackageData.version}
					</Typography>

					<div>{packageDetail()}</div>
				</Grid>
			</Grid>
		</div>
	);

	return content();
}
export default PackageDetailBody;
