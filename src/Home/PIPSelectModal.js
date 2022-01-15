import React, { useContext, useState } from 'react';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	Grid,
	Icon,
	DialogActions,
	Radio,
	Button,
	Typography,
	LinearProgress,
	ListItemIcon,
	ListItemText,
	IconButton,
} from '@mui/material';
import { PIPContext } from '../context/PIPContext';
import {
	AddCircleOutline,
	Delete,
	DeleteOutlined,
	StorageOutlined,
} from '@mui/icons-material';
import PIPAdditionModal from './PIPAdditionModal';
import { FaPython } from 'react-icons/fa';
import { SlideDialogTransition } from '../commons/helpers';
const { ipcRenderer } = window.require('electron');

const GreenRadio = props => (
	<Radio
		style={{ marginRight: 30, padding: 0 }}
		color="secondary"
		{...props}
	/>
);

const PIPSelectModal = ({
	open,
	handleClose,
	pipAdditionModalOpen,
	handlePIPAddition,
	handlePIPAdditionDialogClose,
}) => {
	const [showPIPChangeLoader, setShowPIPChangeLoader] = useState(false);

	const { currentPIP, allPIPS, defaultPIP, PIPContextLoaded } = useContext(
		PIPContext,
	);

	const changeCurrentPIP = pipName => {
		if (pipName !== currentPIP.pipName) {
			ipcRenderer.invoke('CHANGE_CURRENT_PIP', pipName);
			setShowPIPChangeLoader(true);

			setTimeout(() => {
				handleClose();
				setShowPIPChangeLoader(false);
				// window.location.reload();
			}, 2000);
		}
	};

	const deletePIP = pipName => {
		ipcRenderer.invoke('DELETE_PIP', pipName);
	};

	const changePIPLoader = (
		<Grid container direction="column" justifyContent="center" alignItems="center">
			<Grid item>
				<Typography variant="body1" color="textSecondary">
					Changing PIP...
				</Typography>
				<p />
				<LinearProgress color="secondary" variant="indeterminate" />
			</Grid>
		</Grid>
	);

	return (
        <Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
			TransitionComponent={SlideDialogTransition}
		>
			<DialogTitle>
				<Grid container justifyContent="space-between">
					<Grid item>
						<Typography variant="h5" component="div">
							Select Virtual Environment
						</Typography>
					</Grid>
					<Grid item>
						<Button
							color="secondary"
							onClick={handlePIPAddition}
							startIcon={<AddCircleOutline />}
						>
							Add PIP
						</Button>
					</Grid>
				</Grid>
			</DialogTitle>
			<DialogContent>
				{showPIPChangeLoader ? (
					changePIPLoader
				) : (
					<List component="div">
						<ListItem divider style={{ padding: 10 }}>
							<Grid container>
								{[
									{
										name: 'PIP name',
										gridSize: 3,
										icon: <FaPython size="1.25rem" />,
									},
									{
										name: 'PIP Path',
										gridSize: 8,
										icon: (
											<StorageOutlined fontSize="small" />
										),
									},
									{
										name: 'Remove',
										gridSize: 1,
										icon: <Delete fontSize="small" />,
									},
								].map((columnTitleData, index) => (
									<Grid
										key={`columne-title-data-${index}`}
										item
										xs={columnTitleData.gridSize}
									>
										<Typography color="textSecondary">
											<ListItem style={{ padding: 0 }}>
												<ListItemIcon
													style={{ minWidth: 35 }}
												>
													<Typography color="textSecondary">
														{columnTitleData.icon}
													</Typography>
												</ListItemIcon>
												<ListItemText
													style={{ marginTop: 0 }}
													primary={
														columnTitleData.name
													}
												/>
											</ListItem>
										</Typography>
									</Grid>
								))}
							</Grid>
						</ListItem>

						{PIPContextLoaded
							? Object.entries(allPIPS).map(
									([pipName, pipPath], index) => (
										<ListItem
											style={{ padding: 10 }}
											divider
											key={`pip-select-item-${index}`}
										>
											<Grid container>
												<Grid item xs={3}>
													<GreenRadio
														name="current-pip"
														checked={
															currentPIP.pipName ===
															pipName
														}
														onClick={() =>
															changeCurrentPIP(
																pipName,
															)
														}
														value={pipName}
													/>
													<Typography
														component="span"
														variant="body1"
													>
														{pipName}
													</Typography>
												</Grid>
												<Grid item xs={8}>
													<Typography variant="body1">
														<pre
															style={{
																margin: 0,
																padding: 0,
															}}
														>
															{pipPath}
														</pre>
													</Typography>
												</Grid>
												<Grid item container xs={1}>
													{pipName !==
													defaultPIP.pipName ? (
														<IconButton size="small">
															<Delete
																fontSize="small"
																onClick={() =>
																	deletePIP(
																		pipName,
																	)
																}
															/>
														</IconButton>
													) : null}
												</Grid>
											</Grid>
										</ListItem>
									),
							  )
							: null}
					</List>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
    );
};

export default PIPSelectModal;
