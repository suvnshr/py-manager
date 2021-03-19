import React, { useState } from 'react';
import { green } from '@material-ui/core/colors';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	Grid,
	ButtonBase,
	Icon,
	DialogActions,
	Radio,
	withStyles,
	Button,
} from '@material-ui/core';

const GreenRadio = withStyles({
	root: {
		'color': green[400],
		'&$checked': {
			color: green[600],
		},
	},
	checked: {},
})(props => <Radio color="default" {...props} />);

const ENVS = ['main', '1234567890'];

const PIPSelectModal = ({ isOpen, handleClose }) => {
	const [env, setEnv] = useState(ENVS[0]);
	const [open, setOpen] = React.useState(false);

	const [selectedValue, setSelectedValue] = React.useState(ENVS[0]);

	const handleChange = event => {
		setSelectedValue(event.target.value);
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	// const handleClose = () => {
	// 	setOpen(false);
	// };
	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			fullWidth
			maxWidth="md"
		>
			<DialogTitle id="alert-dialog-title">
				Select Virtual Environment
			</DialogTitle>
			<DialogContent>
				<List component="div">
					<ListItem divider>
						<Grid container>
							<Grid item xs={4}>
								<ButtonBase color="textSecondary">
									Pip Name
								</ButtonBase>
							</Grid>
							<Grid item xs={7}>
								<ButtonBase color="textSecondary">
									Pip Path
								</ButtonBase>
							</Grid>
							<Grid item xs={1}>
								<ButtonBase color="textSecondary">
									Remove
								</ButtonBase>
							</Grid>
						</Grid>
					</ListItem>
					{ENVS.map((option, index) => (
						<ListItem divider key={`env-menu-item-${index}`}>
							<Grid container>
								<Grid item xs={4}>
									<GreenRadio
										checked={selectedValue === 'main'}
										onChange={handleChange}
										value={option}
										name="radio-button-demo"
										inputProps={{
											'aria-label': { option },
										}}
									/>{' '}
									{option}
								</Grid>
								<Grid item xs={7}>
									<ButtonBase disableRipple>
										D:\BioShock Infinite - The Complete
										Edition [FitGirl Repack]
									</ButtonBase>
								</Grid>
								<Grid item xs={1}>
									<Icon
										onClick={() => console.log('deleted')}
										// className={classes.delete}
									>
										delete_outline
									</Icon>
								</Grid>
							</Grid>
						</ListItem>
					))}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PIPSelectModal;
