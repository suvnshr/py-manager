import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './commons/index.css';

import customTheme from './commons/theme';
import Root from './commons/Root';
import routes from './commons/routes';

import Home from './components/Home/Home';
import PackageDetail from './components/PackageDetail/PackageDetail';
import { PIPContentProvider } from './context/PIPContext';

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={customTheme}>
			<PIPContentProvider>
				<CssBaseline />
				<Router>
					<Switch>
						<Route exact path={routes.HOME}>
							<Root>
								<Home />
							</Root>
						</Route>
						<Route path={routes.PACKAGE_DETAIL_WITH_PARAM}>
							<PackageDetail />
						</Route>
					</Switch>
				</Router>
			</PIPContentProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
