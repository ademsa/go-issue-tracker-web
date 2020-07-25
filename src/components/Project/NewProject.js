import React from 'react';
import { useHistory } from 'react-router-dom';
import AddProjectMutation from './../../data/mutations/AddProjectMutation';
import RelayEnvironment from './../../data/graphql.relay.config';
import { ProjectForm } from './ProjectForm';
import InfoSnackbar from './../Shared/InfoSnackbar';

export default function NewProject() {
    const history = useHistory()
    function cancelSave() {
        history.push('/projects');
    }

    const [state, setState] = React.useState({
        projectAddError: false,
        projectAddErrorText: ''
    });

    const handleProjectAddErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            projectAddError: false,
        }));
    }

    function handleSaveError(error) {
        setState(prevState => ({
            ...prevState,
            projectAddError: true,
            projectAddErrorText: error,
        }));
    }

    function handleSaveCompleted(id) {
        history.push('/projects/' + id + '?n=1');
    }

    function handleSave(id, name, description) {
        AddProjectMutation.commit(RelayEnvironment, name, description, handleSaveError, handleSaveCompleted)
    }

    return (
        <React.Fragment>
            <ProjectForm
                project={null}
                onCancel={cancelSave}
                onSave={handleSave}
                formTitle='Add New Project' />
            <InfoSnackbar
                message={'Project not added. Error: ' + state.projectAddErrorText}
                severity='error'
                open={state.projectAddError}
                onClose={handleProjectAddErrorSnackbarClosed} />
        </React.Fragment>
    );
}
