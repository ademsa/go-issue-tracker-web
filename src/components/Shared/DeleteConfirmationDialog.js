import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

export default function DeleteConfirmationDialog(props) {
    return (
        <React.Fragment>
            <Dialog open={props.status}>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete {props.title}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onDelete}>DELETE</Button>
                    <Button onClick={props.onCancel}>CANCEL</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
