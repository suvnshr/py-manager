import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import compareVersions from 'compare-versions';

import PackageDetailBody from './PackageDetailBody';
import PackageDetailHeader from './PackageDetailHeader';

import FullScreenLoader from '../commons/FullScreenLoader';

const { ipcRenderer } = window.require('electron');

function PackageDetail() {
	const { packageName } = useParams();
	const [packageData, setPackageData] = useState(null);
	const [localPackageData, setLocalPackageData] = useState(null);

	const [updatable, setUpdatable] = useState(false);

	useEffect(() => {
		ipcRenderer.invoke('RECEIVE_LOCAL_DETAIL', packageName);

		ipcRenderer.on('SEND_LOCAL_DETAIL', function (ev, _localPackageData) {
			setLocalPackageData(_localPackageData);
		});

		ipcRenderer.invoke('GET_PYPI_PACKAGE_DATA', packageName);

		ipcRenderer.on(
			'PYPI_PACKAGE_DATA_OF_' + packageName,
			(ev, _packageData) => setPackageData(_packageData),
		);

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
		return <FullScreenLoader />;
	}
}

export default PackageDetail;
