import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { SearchOutlined } from '@material-ui/icons';
import {
	Container,
	Grid,
	InputAdornment,
	ListItemIcon,
	TextField,
} from '@material-ui/core';
import { FaPython } from 'react-icons/fa';

const useStyles = makeStyles(theme => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function InstallPackagesModal({ isOpen, handleClose }) {
	const classes = useStyles();

	return (
		<div>
			<Dialog
				fullScreen
				open={isOpen}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Install Packages
						</Typography>
						<Button autoFocus color="inherit" onClick={handleClose}>
							Install
						</Button>
					</Toolbar>
				</AppBar>

				<Container>
					<p />
					<Grid container>
						<Grid lg={3} xl={4} />
						<Grid xs={12} lg={6} xl={4}>
							<TextField
								fullWidth={true}
								label="Install Packages"
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchOutlined color="primary" />
										</InputAdornment>
									),
								}}
							/>

							{/* Search Results */}

							<List>
								<ListItem button>
									<ListItemIcon>
										<FaPython fontSize={24}/>
									</ListItemIcon>
									<ListItemText
										primary="Django"
										secondary="A high-level Python Web framework that encourages rapid development and clean, pragmatic design"
									/>
								</ListItem>
							</List>
						</Grid>
					</Grid>
				</Container>
			</Dialog>
		</div>
	);
}
