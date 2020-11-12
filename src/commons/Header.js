import React from "react";
import {
    Typography,
    makeStyles,
    AppBar,
    Toolbar,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
}));

function Header() {
    const classes = useStyles();

    return (
        <header className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        PyManager
                    </Typography>
                </Toolbar>
            </AppBar>
        </header>
    );
}

export default Header;
