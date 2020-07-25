import React from 'react';
import { useHistory } from 'react-router-dom';
import AddLabelMutation from './../../data/mutations/AddLabelMutation';
import RelayEnvironment from './../../data/graphql.relay.config';
import { LabelForm } from './LabelForm';
import InfoSnackbar from './../Shared/InfoSnackbar';

export default function NewLabel() {
    const history = useHistory()
    function cancelSave() {
        history.push('/labels');
    }

    const [state, setState] = React.useState({
        labelAddError: false,
        labelAddErrorText: ''
    });

    const handleLabelAddErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            labelAddError: false,
        }));
    }

    function handleSaveError(error) {
        setState(prevState => ({
            ...prevState,
            labelAddError: true,
            labelAddErrorText: error,
        }));
    }

    function handleSaveCompleted(id) {
        history.push('/labels/' + id + '?n=1');
    }

    function handleSave(id, name, colorHexCode) {
        AddLabelMutation.commit(RelayEnvironment, name, colorHexCode, handleSaveError, handleSaveCompleted)
    }

    return (
        <React.Fragment>
            <LabelForm
                label={null}
                onCancel={cancelSave}
                onSave={handleSave}
                formTitle='Add New Label' />
            <InfoSnackbar
                message={'Label not added. Error: ' + state.labelAddErrorText}
                severity='error'
                open={state.labelAddError}
                onClose={handleLabelAddErrorSnackbarClosed} />
        </React.Fragment>
    );
}
