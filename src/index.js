import React from "react";
import ReactDOM from "react-dom";
import Home from "./home/Home";
import "./commons/index.css";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import theme from "./commons/theme";
import Root from "./commons/Root";
import routes from "./commons/routes";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route exact path={routes.HOME}>
                        <Root>
                            <Home />
                        </Root>
                    </Route>
                </Switch>
            </ThemeProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
