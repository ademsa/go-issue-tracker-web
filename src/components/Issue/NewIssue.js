import React from 'react';
import { useHistory } from 'react-router-dom';
import AddIssueMutation from './../../data/mutations/AddIssueMutation';
import RelayEnvironment from './../../data/graphql.relay.config';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import { IssueForm } from './IssueForm';
import InfoSnackbar from './../Shared/InfoSnackbar';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';

export default function NewIssue() {
    const history = useHistory();
    function cancelSave() {
        history.push('/issues');
    }

    const [state, setState] = React.useState({
        issueAddError: false,
        issueAddErrorText: ''
    });

    const handleIssueAddErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            issueAddError: false,
        }));
    }

    function handleSaveError(error) {
        setState(prevState => ({
            ...prevState,
            issueAddError: true,
            issueAddErrorText: error,
        }));
    }

    function handleSaveCompleted(id) {
        history.push('/issues/' + id + '?n=1');
    }

    function handleSave(id, title, description, status, project, labels) {
        AddIssueMutation.commit(RelayEnvironment, title, description, status, project, labels, handleSaveError, handleSaveCompleted)
    }

    React.useEffect(() => {
        document.title = 'Issue Tracker - New Issue'
    }, [])

    return (
        <React.Fragment>
            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query NewIssueQuery {
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
                render={({ error, props }) => {
                    if (error) {
                        return <QRError error={error} />
                    }
                    if (!props) {
                        return <QRLoading />
                    }

                    return <React.Fragment>
                        <IssueForm
                            issue={null}
                            allProjects={props.allProjects}
                            allLabels={props.allLabels}
                            onCancel={cancelSave}
                            onSave={handleSave}
                            formTitle='Add New Issue' />
                    </React.Fragment>
                }}
            />

            <InfoSnackbar
                message={'Issue not added. Error: ' + state.issueAddErrorText}
                severity='error'
                open={state.issueAddError}
                onClose={handleIssueAddErrorSnackbarClosed} />
        </React.Fragment>
    );
}
