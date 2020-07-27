import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import { GetQuery } from './../../routing';
import RelayEnvironment from './../../data/graphql.relay.config';
import IssueForm from './IssueForm';
import InfoSnackbar from './../Shared/InfoSnackbar';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';
import UpdateIssueMutation from './../../data/mutations/UpdateIssueMutation';

export default function EditIssue() {
    const query = GetQuery();
    const { id } = useParams();

    let initialState = {
        issueUpdateSuccess: false,
        issueUpdateError: false,
        issueUpdateErrorText: '',
        issueAddSuccess: query.has('n') ? true : false,
    };

    const [state, setState] = React.useState(initialState);

    const history = useHistory()
    function handleCancel() {
        history.push('/issues');
    }

    function handleSaveError(error) {
        setState(prevState => ({
            ...prevState,
            issueUpdateError: true,
            issueUpdateErrorText: error,
        }));
    }

    function handleSaveCompleted(id) {
        setState(prevState => ({
            ...prevState,
            issueUpdateSuccess: true,
        }));
    }

    function handleSave(id, title, description, status, project, labels) {
        UpdateIssueMutation.commit(RelayEnvironment, id, title, description, status, labels, handleSaveError, handleSaveCompleted)
    }

    const handleIssueUpdateSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            issueUpdateSuccess: false,
        }));
    }

    const handleIssueUpdateErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            issueUpdateError: false,
        }));
    }

    const handleIssueAddSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            issueAddSuccess: false,
        }));
    }

    React.useEffect(() => {
        document.title = 'Issue Tracker - Edit Issue'
    }, [])

    return (
        <React.Fragment>
            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query EditIssueQuery ($id: ID!){
                        node(id: $id){
                            id
                            ...IssueForm_issue
                        }
                        allLabels {
                            id
                            name
                        }
                        allProjects {
                            id
                            name
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

                    return <IssueForm
                        issue={props.node}
                        allProjects={props.allProjects}
                        allLabels={props.allLabels}
                        formTitle='Edit Issue'
                        onCancel={handleCancel}
                        onSave={handleSave} />
                }}
            />
            <InfoSnackbar
                message='Issue successfully updated.'
                severity='success'
                open={state.issueUpdateSuccess}
                onClose={handleIssueUpdateSuccessSnackbarClosed} />
            <InfoSnackbar
                message={'Issue not updated. Error: ' + state.issueUpdateErrorText}
                severity='error'
                open={state.issueUpdateError}
                onClose={handleIssueUpdateErrorSnackbarClosed} />
            <InfoSnackbar
                message='Issue successfully added.'
                severity='success'
                open={state.issueAddSuccess}
                onClose={handleIssueAddSuccessSnackbarClosed} />
        </React.Fragment>
    );
}
