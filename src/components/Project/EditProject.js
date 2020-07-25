import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import { GetQuery } from './../../routing';
import RelayEnvironment from './../../data/graphql.relay.config';
import ProjectForm from './ProjectForm';
import InfoSnackbar from './../Shared/InfoSnackbar';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';
import UpdateProjectMutation from './../../data/mutations/UpdateProjectMutation';

export default function EditProject() {
    const query = GetQuery();
    const { id } = useParams();
    let initialState = {
        projectUpdateSuccess: false,
        projectUpdateError: false,
        projectUpdateErrorText: '',
        projectAddSuccess: query.has('n') ? true : false,
    };

    const [state, setState] = React.useState(initialState);

    const history = useHistory()
    function handleCancel() {
        history.push('/projects');
    }

    function handleSaveError(error) {
        setState(prevState => ({
            ...prevState,
            projectUpdateError: true,
            projectUpdateErrorText: error,
        }));
    }

    function handleSaveCompleted(id) {
        setState(prevState => ({
            ...prevState,
            projectUpdateSuccess: true,
        }));
    }

    function handleSave(id, name, description) {
        UpdateProjectMutation.commit(RelayEnvironment, id, name, description, handleSaveError, handleSaveCompleted)
    }

    const handleProjectUpdateSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            projectUpdateSuccess: false,
        }));
    }

    const handleProjectUpdateErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            projectUpdateError: false,
        }));
    }

    const handleProjectAddSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            projectAddSuccess: false,
        }));
    }

    return (
        <React.Fragment>
            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query EditProjectQuery ($id: ID!){
                        node(id: $id){
                            id
                            ...ProjectForm_project
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

                    return <ProjectForm
                        project={props.node}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        formTitle='Edit Project' />
                }}
            />
            <InfoSnackbar
                message='Project successfully updated.'
                severity='success'
                open={state.projectUpdateSuccess}
                onClose={handleProjectUpdateSuccessSnackbarClosed} />
            <InfoSnackbar
                message={'Project not updated. Error: ' + state.projectUpdateErrorText}
                severity='error'
                open={state.projectUpdateError}
                onClose={handleProjectUpdateErrorSnackbarClosed} />
            <InfoSnackbar
                message='Project successfully added.'
                severity='success'
                open={state.projectAddSuccess}
                onClose={handleProjectAddSuccessSnackbarClosed} />
        </React.Fragment>
    );
}
