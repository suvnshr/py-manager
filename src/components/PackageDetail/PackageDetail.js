import { CircularProgress, Grid } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import eventNames from '../commons/eventNames';
import compareVersions from 'compare-versions';
import {
	LanguageRounded,
	MenuBookRounded,
	StorageRounded,
	SupervisedUserCircleRounded,
} from '@material-ui/icons';
import PackageDetailBody from './PackageDetailBody';
import PackageDetailHeader from './PackageDetailHeader';

const { ipcRenderer } = window.require('electron');

const packageProperties = {
	'author': <SupervisedUserCircleRounded />,
	'home-page': <LanguageRounded />,
	'license': <MenuBookRounded />,
	'location': <StorageRounded />,
};

function PackageDetail() {
	const { packageName } = useParams();
	const [packageData, setPackageData] = useState(null);
	const [localPackageData, setLocalPackageData] = useState(null);

	const [updatable, setUpdatable] = useState(false);

	useEffect(() => {
		ipcRenderer.invoke('RECEIVE_LOCAL_DETAIL', packageName);

		axios
			.get(`https://pypi.org/pypi/${packageName}/json`)
			.then(res => {
				setPackageData(res.data);
			})
			.catch(err => {
				setPackageData(-1);
			});

		ipcRenderer.on('SEND_LOCAL_DETAIL', function (ev, _localPackageData) {
			setLocalPackageData(_localPackageData);
		});

		if (
			packageData !== null &&
			localPackageData !== null &&
			packageData !== -1
		) {
			let _updatable = compareVersions.compare(
				packageData.info.version,
				localPackageData.version,
				'<',
			);

			setUpdatable(Boolean(_updatable));
		}
	}, [packageName]);

	// useEffect(() => {

	// }, [packageData]);

	const loader = (
		<Grid
			container
			justify="center"
			alignContent="center"
			style={{ height: '80vh' }}
		>
			<CircularProgress color="primary" />
		</Grid>
	);

	if (packageData !== null && localPackageData !== null) {
		return (
			<div>
				<PackageDetailHeader
					{...{ packageName, updatable, localPackageData }}
				/>

				<PackageDetailBody
					{...{
						localPackageData,
						packageData,
						packageName,
						setPackageData,
						setLocalPackageData,
					}}
				/>
			</div>
		);
	} else {
		return loader;
	}
}

export default PackageDetail;
