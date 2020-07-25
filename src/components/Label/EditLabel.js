import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import { GetQuery } from './../../routing';
import RelayEnvironment from './../../data/graphql.relay.config';
import UpdateLabelMutation from './../../data/mutations/UpdateLabelMutation';
import LabelForm from './LabelForm';
import InfoSnackbar from './../Shared/InfoSnackbar';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';

export default function EditLabel() {
    const query = GetQuery();
    const { id } = useParams();

    let initialState = {
        labelUpdateSuccess: false,
        labelUpdateError: false,
        labelUpdateErrorText: '',
        labelAddSuccess: query.has('n') ? true : false,
    };

    const [state, setState] = React.useState(initialState);

    const history = useHistory()
    function handleCancel() {
        history.push('/labels');
    }

    function handleSaveError(error) {
        setState(prevState => ({
            ...prevState,
            labelUpdateError: true,
            labelUpdateErrorText: error,
        }));
    }

    function handleSaveCompleted(id) {
        setState(prevState => ({
            ...prevState,
            labelUpdateSuccess: true,
        }));
    }

    function handleSave(id, name, colorHexCode) {
        UpdateLabelMutation.commit(RelayEnvironment, id, name, colorHexCode, handleSaveError, handleSaveCompleted)
    }

    const handleLabelUpdateSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            labelUpdateSuccess: false,
        }));
    }

    const handleLabelUpdateErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            labelUpdateError: false,
        }));
    }

    const handleLabelAddSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            labelAddSuccess: false,
        }));
    }

    return (
        <React.Fragment>
            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query EditLabelQuery ($id: ID!){
                        node(id: $id){
                            id
                            ...LabelForm_label
                        }
                    }
                `}
                variables={{ id }}
                render={({ error, props }) => {
                    if (error) {
                        return <QRError error={error} />
                    }
                    if (!props) {
                        return <QRLoading />
                    }

                    return <LabelForm
                        label={props.node}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        formTitle='Edit Label' />
                }}
            />
            <InfoSnackbar
                message='Label successfully updated.'
                severity='success'
                open={state.labelUpdateSuccess}
                onClose={handleLabelUpdateSuccessSnackbarClosed} />
            <InfoSnackbar
                message={'Label not updated. Error: ' + state.labelUpdateErrorText}
                severity='error'
                open={state.labelUpdateError}
                onClose={handleLabelUpdateErrorSnackbarClosed} />
            <InfoSnackbar
                message='Label successfully added.'
                severity='success'
                open={state.labelAddSuccess}
                onClose={handleLabelAddSuccessSnackbarClosed} />
        </React.Fragment>
    );
}
