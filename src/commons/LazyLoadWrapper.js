import React from 'react';
import LazyLoad from 'react-lazyload';

function LazyLoadWrapper({ height = 10, margin=10, children }) {
	return (
		<LazyLoad
			offset={100}
			height={height}
			// once
		>
			{children}
		</LazyLoad>
	);
}

export default LazyLoadWrapper;
