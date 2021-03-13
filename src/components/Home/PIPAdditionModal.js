import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FolderOpenOutlined } from '@material-ui/icons';
import {
	Grid,
	OutlinedInput,
	FormControl,
	InputAdornment,
	IconButton,
	InputLabel,
	Input,
	FormHelperText,
	Typography,
} from '@material-ui/core';

const { ipcRenderer } = window.require('electron');

export default function PIPAdditionModal({ isOpen, handleClose }) {
	const [pipName, setPIPName] = useState('');
	const [pipPath, setPipPath] = useState('');

	const [pipNameError, setPIPNameError] = useState('');
	const [pipPathError, setPipPathError] = useState('');

	const pickPIP = ev => {
		ipcRenderer.invoke('PIP_FILE_DIALOG');
	};

	const handleSubmit = ev => {
		ipcRenderer.invoke('PIP_ADDITION', pipName, pipPath);
	};

	const handlePIPNameChange = ev => {
		setPIPName(ev.target.value);
	};

	useEffect(() => {
		ipcRenderer.on(
			'PIP_FILE_DIALOG_RESULTS',
			function (ev, pipPath, dialogCancelled) {
				setPipPath(pipPath);

				// If the PIP picker dialog is cancelled
				if (dialogCancelled) {
					setPipPathError('Please select a PIP path');
					return;
				} else {
					setPipPathError('');
				}
			},
		);

		ipcRenderer.on(
			'PIP_ADDITION_RESULTS',
			function (ev, isPIPAdded, pipNameError, pipPathError) {
				if (isPIPAdded) {
					// Close the modal and refresh the page
					handleClose();
					window.location.reload()
				} else {
					setPIPNameError(pipNameError);
					setPipPathError(pipPathError);
				}
			},
		);
	}, []);

	return (
		<div>
			<Dialog
				keepMounted={true}
				disableBackdropClick={true}
				open={isOpen}
				fullWidth={true}
				onClose={handleClose}
			>
				<DialogTitle>
					Add a PIP path
					<Typography variant="subtitle1" color="textSecondary">
						Add a PIP path to PyManager
					</Typography>
				</DialogTitle>
				<DialogContent>
					<TextField
						onKeyUp={handlePIPNameChange}
						label="PIP name"
						error={Boolean(pipNameError)}
						helperText={pipNameError}
						type="text"
						variant="outlined"
						fullWidth
					/>

					<p />

					<FormControl fullWidth={true} variant="outlined">
						<InputLabel
							error={pipPathError}
							htmlFor="pip-input"
						>
							PIP folder
						</InputLabel>
						<OutlinedInput
							id="pip-input"
							error={pipPathError}
							value={pipPath}
							readOnly={true}
							labelWidth={65}
							endAdornment={
								<InputAdornment position="end">
									<IconButton onClick={pickPIP} edge="end">
										<FolderOpenOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
						<FormHelperText error={pipPathError}>
							{pipPathError}
						</FormHelperText>
					</FormControl>
					<p/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						color="secondary"
						variant="contained"
					>
						Add PIP
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
