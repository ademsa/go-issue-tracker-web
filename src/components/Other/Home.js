import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, Typography, Chip } from '@material-ui/core';
import graphql from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay';
import RelayEnvironment from './../../data/graphql.relay.config';
import QRError from './../Shared/QRError';
import QRLoading from './../Shared/QRLoading';

const useStyles = makeStyles((theme) => ({
    Section: {
        textAlign: 'center',
    },
    SectionTitle: {
        '@media (max-width: 992px)': {
            fontSize: theme.typography.pxToRem(48)
        }
    },
    ProjectItem: {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.success.main,
        },
        color: theme.palette.primary.contrastText,
        margin: theme.spacing(0.5),
    },
    LabelItem: {
        backgroundColor: theme.palette.success.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
        color: theme.palette.primary.contrastText,
        margin: theme.spacing(0.5),
    },
}));

export default function Home() {
    const classes = useStyles();

    const history = useHistory();
    function openIssuesFilteredByProject(event) {
        history.push('/issues?fp=' + event.currentTarget.dataset.id);
    }
    function openIssuesFilteredByLabel(event) {
        history.push('/issues?fl=' + event.currentTarget.dataset.id);
    }

    React.useEffect(() => {
        document.title = 'Issue Tracker'
    }, [])

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} className={classes.Section}>
                    <Typography variant='h1' color='primary' className={classes.SectionTitle}>
                        welcome
                    </Typography>
                </Grid>
                <QueryRenderer
                    environment={RelayEnvironment}
                    query={graphql`
                    query HomeQuery {
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
                            <Grid item xs={12} className={classes.Section}>
                                {props.allProjects.map((project) => (
                                    <Chip className={classes.ProjectItem} key={project.id} label={project.name} clickable={true} data-id={project.id} onClick={openIssuesFilteredByProject} />
                                ))}
                            </Grid>
                            <Grid item xs={12} className={classes.Section}>
                                {props.allLabels.map((label) =>
                                    <Chip className={classes.LabelItem} key={label.id} label={label.name} clickable={true} data-id={label.id} onClick={openIssuesFilteredByLabel} />
                                )}
                            </Grid>
                        </React.Fragment>
                    }}
                />
            </Grid>
        </React.Fragment>
    );
}
