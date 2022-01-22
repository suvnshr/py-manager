import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
	Avatar,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { GitHub } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
const { ipcRenderer } = window.require('electron');

function UserListItem({ name, image, desc, ghLink }) {
	return (
		<ListItem
			sx={{ py: 1, mx: 0.5 }}
			disablePadding
			divider
			secondaryAction={
				<IconButton edge="end" onClick={() => ipcRenderer.invoke("OPEN_LINK", ghLink)}>
					<GitHub  />
				</IconButton>
			}
		>
			<ListItemAvatar>
				<Avatar alt={name} src={image} />
			</ListItemAvatar>
			<ListItemText primary={name} secondary={desc} />
		</ListItem>
	);
}

export default function AboutUsDialog({ open, handleAboutUsDialogClose }) {
	const theme = useTheme();

	return (
		<Dialog open={open} onClose={handleAboutUsDialogClose}>
			<DialogTitle sx={{ color: theme.palette.primary.main }}>
				About
			</DialogTitle>
			{/* <Divider /> */}

			<DialogContent>
				<Box sx={{ mb: 2 }}>
					<DialogContentText>
						<Typography variant="h6" color="text.primary">
							Py Manager
						</Typography>
						A GUI based package manager for python
					</DialogContentText>
					<Divider sx={{ mt: 1.5 }} />
				</Box>

				<Box >
					<DialogContentText>
						<Typography variant="h6" color="text.primary">
							We
						</Typography>
						We're just some developers trying to make useful stuff
					</DialogContentText>

					<List sx={{ my: 1 }}>
						<UserListItem
							name={'Suvansh Rana'}
							image={
								'https://avatars.githubusercontent.com/u/36293610?s=300'
							}
							desc={'Software Engineer'}
              ghLink={'https://github.com/suvansh-rana'}

						/>
						<UserListItem
							name={'Aayush Bisen'}
							image={
								'https://avatars.githubusercontent.com/u/41341387?v=4&s=300'
							}
							desc={'Software Engineer'}
              ghLink={'https://github.com/aayushbisen'}

						/>
					</List>
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleAboutUsDialogClose} autoFocus>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
