import React from 'react';
import { Grid } from '@material-ui/core';
import ProjectItem from './ProjectItem'
import ProjectsFilter from './ProjectsFilter'
import RelayEnvironment from './../../data/graphql.relay.config';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import InfoSnackbar from './../Shared/InfoSnackbar';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';
import QRNoItems from './../Shared/QRNoItems';
import RemoveProjectMutation from './../../data/mutations/RemoveProjectMutation';

export default function Projects() {
    const [state, setState] = React.useState({
        filterName: '',
        projectRemoveSuccess: false,
        projectRemoveError: false,
        projectRemoveErrorText: '',
    });

    const handleProjectRemoveSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            projectRemoveSuccess: false,
        }));
    }

    const handleProjectRemoveErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            projectRemoveError: false,
        }));
    }

    function handleRemoveError(error) {
        setState(prevState => ({
            ...prevState,
            projectRemoveError: true,
            projectRemoveErrorText: error,
        }));
    }

    function handleRemoveCompleted(response) {
        if (response !== undefined && response.removeProject.status) {
            setState(prevState => ({
                ...prevState,
                projectRemoveSuccess: true,
            }));
        }
    }

    function handleDelete(id) {
        RemoveProjectMutation.commit(RelayEnvironment, id, handleRemoveError, handleRemoveCompleted)
    }

    function handleFilterChange(filterName) {
        setState(prevState => ({
            ...prevState,
            filterName: filterName,
        }));
    }

    return (
        <React.Fragment>
            <ProjectsFilter onChange={handleFilterChange} />
            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query ProjectsQuery($name: String) {
                        projects(name: $name) {
                            id
                            name
                            description
                        }
                    }
                `}
                variables={{ name: state.filterName }}
                render={({ error, props }) => {
                    if (error) {
                        return <QRError error={error} />
                    }
                    if (!props) {
                        return <QRLoading />
                    }

                    if (props.projects.length === 0) {
                        return <QRNoItems message="No projects found." />
                    }

                    return <React.Fragment>
                        <Grid container spacing={3}>
                            {props.projects.map((project) => (
                                project !== null && <Grid item xs={12} md={4} key={project.id}>
                                    <ProjectItem
                                        id={project.id}
                                        name={project.name}
                                        description={project.description}
                                        onDelete={handleDelete} />
                                </Grid>
                            ))}
                        </Grid>
                        <InfoSnackbar
                            message='Project successfully removed.'
                            severity='success'
                            open={state.projectRemoveSuccess}
                            onClose={handleProjectRemoveSuccessSnackbarClosed} />
                        <InfoSnackbar
                            message={'Project not removed. Error: ' + state.projectRemoveErrorText}
                            severity='error'
                            open={state.projectRemoveError}
                            onClose={handleProjectRemoveErrorSnackbarClosed} />
                    </React.Fragment>
                }}
            />
        </React.Fragment>
    );
}
