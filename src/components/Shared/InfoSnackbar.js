import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export default function InfoSnackbar(props) {
    return (
        <React.Fragment>
            <Snackbar
                autoHideDuration={5000}
                open={props.open}
                onClose={props.onClose}>
                <Alert onClose={props.onClose} severity={props.severity} variant='filled'>
                    {props.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}
