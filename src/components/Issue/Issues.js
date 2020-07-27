import React from 'react';
import { Grid } from '@material-ui/core';
import IssueItem from './IssueItem'
import IssuesFilter from './IssuesFilter'
import { GetQuery } from './../../routing';
import RelayEnvironment from './../../data/graphql.relay.config';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import InfoSnackbar from './../Shared/InfoSnackbar';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';
import QRNoItems from './../Shared/QRNoItems';
import RemoveIssueMutation from './../../data/mutations/RemoveIssueMutation';

export default function Issues() {
    const query = GetQuery();
    let paramProjectId = '';
    if (query.has('fp')) {
        paramProjectId = query.get('fp');
    }
    let paramLabels = [];
    let fl = ''
    if (query.has('fl')) {
        fl = query.get('fl')
    }

    const [state, setState] = React.useState({
        filterTitle: '',
        filterProject: paramProjectId,
        filterLabels: fl,
        issueRemoveSuccess: false,
        issueRemoveError: false,
        issueRemoveErrorText: '',
    });

    const handleIssueRemoveSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            issueRemoveSuccess: false,
        }));
    }

    const handleIssueRemoveErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            issueRemoveError: false,
        }));
    }

    function handleRemoveError(error) {
        setState(prevState => ({
            ...prevState,
            issueRemoveError: true,
            issueRemoveErrorText: error,
        }));
    }

    function handleRemoveCompleted(response) {
        if (response !== undefined && response.removeIssue.status) {
            setState(prevState => ({
                ...prevState,
                issueRemoveSuccess: true,
            }));
        }
    }

    function handleDelete(id) {
        RemoveIssueMutation.commit(RelayEnvironment, id, handleRemoveError, handleRemoveCompleted)
    }

    function handleFilterChange(filterTitle, filterProject, filterLabels) {
        setState(prevState => ({
            ...prevState,
            filterTitle: filterTitle,
            filterProject: filterProject,
            filterLabels: filterLabels,
        }));
    }

    React.useEffect(() => {
        document.title = 'Issue Tracker - Issues'
    }, [])

    return (
        <React.Fragment>
            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query IssuesFilterQuery {
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

                    if (fl !== '' && props.allLabels) {
                        paramLabels = props.allLabels.filter(l => l.id === fl) || []
                    }

                    return <React.Fragment>
                        <IssuesFilter
                            paramProjectId={paramProjectId}
                            paramLabels={paramLabels}
                            projects={props.allProjects}
                            labels={props.allLabels}
                            onChange={handleFilterChange} />
                    </React.Fragment>
                }}
            />

            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query IssuesQuery($title: String, $projectId: String, $labels: String) {
                        issues(title: $title, projectId: $projectId, labels: $labels) {
                            id
                            title
                            description
                            status
                            project{
                                id
                                name
                            }
                            labels(first:1000) @connection(key:"Issues_labels"){
                                edges{
                                    node{
                                        id
                                        name
                                    }
                                }
                            }
                            createdAt
                        }
                    }
                `}
                variables={{
                    title: state.filterTitle,
                    projectId: state.filterProject,
                    labels: state.filterLabels,
                }}
                render={({ error, props }) => {
                    if (error) {
                        return <QRError error={error} />
                    }
                    if (!props) {
                        return <QRLoading />
                    }

                    if (props.issues.length === 0) {
                        return <QRNoItems message="No issues found." />
                    }

                    return <React.Fragment>
                        <Grid container spacing={3}>
                            {props.issues.map((issue) => (
                                issue !== null && <Grid item xs={12} md={4} key={issue.id}>
                                    <IssueItem
                                        id={issue.id}
                                        title={issue.title}
                                        description={issue.description}
                                        status={issue.status}
                                        project={issue.project}
                                        labels={issue.labels}
                                        createdAt={issue.createdAt}
                                        onDelete={handleDelete} />
                                </Grid>
                            ))}
                        </Grid>
                        <InfoSnackbar
                            message='Issue successfully removed.'
                            severity='success'
                            open={state.issueRemoveSuccess}
                            onClose={handleIssueRemoveSuccessSnackbarClosed} />
                        <InfoSnackbar
                            message={'Issue not removed. Error: ' + state.issueRemoveErrorText}
                            severity='error'
                            open={state.issueRemoveError}
                            onClose={handleIssueRemoveErrorSnackbarClosed} />
                    </React.Fragment>
                }}
            />
        </React.Fragment>
    );
}
