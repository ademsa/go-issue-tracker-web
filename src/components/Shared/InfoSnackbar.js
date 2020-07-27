import React from 'react';
import PropTypes from 'prop-types'
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function InfoSnackbar(props) {
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

InfoSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    severity: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default InfoSnackbar;
