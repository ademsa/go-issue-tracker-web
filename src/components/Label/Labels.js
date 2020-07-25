import React from 'react';
import { Grid } from '@material-ui/core';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import RelayEnvironment from './../../data/graphql.relay.config';
import LabelItem from './LabelItem'
import LabelsFilter from './LabelsFilter'
import InfoSnackbar from './../Shared/InfoSnackbar';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';
import QRNoItems from './../Shared/QRNoItems';
import RemoveLabelMutation from './../../data/mutations/RemoveLabelMutation';

export default function Labels() {
    const [state, setState] = React.useState({
        filterName: '',
        labelRemoveSuccess: false,
        labelRemoveError: false,
        labelRemoveErrorText: '',
    });

    const handleLabelRemoveSuccessSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            labelRemoveSuccess: false,
        }));
    }

    const handleLabelRemoveErrorSnackbarClosed = () => {
        setState(prevState => ({
            ...prevState,
            labelRemoveError: false,
        }));
    }

    function handleRemoveError(error) {
        setState(prevState => ({
            ...prevState,
            labelRemoveError: true,
            labelRemoveErrorText: error,
        }));
    }

    function handleRemoveCompleted(response) {
        if (response !== undefined && response.removeLabel.status) {
            setState(prevState => ({
                ...prevState,
                labelRemoveSuccess: true,
            }));
        }
    }

    function handleDelete(id) {
        RemoveLabelMutation.commit(RelayEnvironment, id, handleRemoveError, handleRemoveCompleted)
    }

    function handleFilterChange(filterName) {
        setState(prevState => ({
            ...prevState,
            filterName: filterName,
        }));
    }

    return (
        <React.Fragment>
            <LabelsFilter onChange={handleFilterChange} />
            <QueryRenderer
                environment={RelayEnvironment}
                query={graphql`
                    query LabelsQuery($name: String) {
                        labels(name: $name) {
                            id
                            name
                            colorHexCode
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

                    if (props.labels.length === 0) {
                        return <QRNoItems message="No labels found." />
                    }

                    return <React.Fragment>
                        <Grid container spacing={3}>
                            {props.labels.map((label) => (
                                label !== null && <Grid item xs={12} md={4} key={label.id}>
                                    <LabelItem
                                        id={label.id}
                                        name={label.name}
                                        colorHexCode={label.colorHexCode}
                                        onDelete={handleDelete} />
                                </Grid>
                            ))}
                        </Grid>
                        <InfoSnackbar
                            message='Label successfully removed.'
                            severity='success'
                            open={state.labelRemoveSuccess}
                            onClose={handleLabelRemoveSuccessSnackbarClosed} />
                        <InfoSnackbar
                            message={'Label not removed. Error: ' + state.labelRemoveErrorText}
                            severity='error'
                            open={state.labelRemoveError}
                            onClose={handleLabelRemoveErrorSnackbarClosed} />
                    </React.Fragment>
                }}
            />
        </React.Fragment>
    );
}
