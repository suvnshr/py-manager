import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function EnvAdditionModal({isOpen, handleClose }) {

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} >
        <DialogTitle>Add Env</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a python virtual environment to PyManager
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="env-name"
            label="Env name"
            type="text"
            fullWidth
          />
          
          <TextField
            autoFocus
            margin="dense"
            id="env-path"
            label="Env Path"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Add Env
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
