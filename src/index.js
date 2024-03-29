import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import './commons/index.css';

import customTheme from './commons/theme';
import routes from './commons/routes';

import PackageDetail from './PackageDetail/PackageDetail';
import { PIPContentProvider } from './context/PIPContext';
import HomeOrOnboarding from './Home/HomeOrOnboarding';

ReactDOM.render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
            <ThemeProvider theme={customTheme}>
                <PIPContentProvider>
                    <CssBaseline />
                    <Router>
                        <Switch>
                            <Route exact path={routes.HOME}>
                                <HomeOrOnboarding />
                            </Route>
                            <Route path={routes.PACKAGE_DETAIL_WITH_PARAM}>
                                <PackageDetail />
                            </Route>
                        </Switch>
                    </Router>
                </PIPContentProvider>
            </ThemeProvider>
        </StyledEngineProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
