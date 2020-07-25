import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button, Chip, Typography, IconButton, Card, CardContent, CardActions, CardHeader, Avatar, CardActionArea } from '@material-ui/core';
import { Edit, DeleteForever, BugReport } from '@material-ui/icons';
import DeleteConfirmationDialog from './../Shared/DeleteConfirmationDialog';

const useStyles = makeStyles((theme) => ({
    Card: {
        backgroundColor: theme.palette.primary.main,
    },
    CardAvatar: {
        backgroundColor: theme.palette.background.paper,
    },
    CardLabels: {
        marginTop: theme.spacing(1),
    },
    CardLabel: {
        color: theme.palette.primary.contrastText,
        borderColor: theme.palette.secondary.main,
        margin: theme.spacing(0.5),
    },
    CardActions: {
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        alignItems: 'center',
    },
    CardProject: {
        flexGrow: 1,
    },
}));

export default function IssueItem(props) {
    const classes = useStyles();

    const { id, title, description, project, labels, createdAt } = props;

    const history = useHistory();
    function openIssue() {
        history.push('/issues/' + id);
    }
    function openProject() {
        history.push('/projects/' + project.id);
    }
    function openLabel(event) {
        history.push('/labels/' + event.currentTarget.dataset.id);
    }

    const [state, setState] = React.useState({
        deleteConfirmationUI: false,
    });

    const handleDeleteConfirmation = () => {
        setState(prevState => ({
            ...prevState,
            deleteConfirmationUI: true,
        }));
    }
    function handleDeleteCanceled() {
        setState(prevState => ({
            ...prevState,
            deleteConfirmationUI: false,
        }));
    }
    function handleDelete() {
        setState(prevState => ({
            ...prevState,
            deleteConfirmationUI: false,
        }));
        props.onDelete(id)
    }

    return (
        <React.Fragment>
            <Card className={classes.Card}>
                <CardActionArea onClick={openIssue}>
                    <CardHeader
                        title={title}
                        subheader={new Date(createdAt).toLocaleDateString("en-US")}
                        avatar={<Avatar className={classes.CardAvatar}><BugReport color='secondary' /></Avatar>} />
                    <CardContent>
                        <Typography>{description}</Typography>
                        {labels.edges.length > 0 &&
                            <div className={classes.CardLabels}>
                                {labels.edges.map((label) =>
                                    <Chip variant='outlined' size='small' key={label.node.id} label={label.node.name} className={classes.CardLabel} clickable={true} data-id={label.node.id} onClick={openLabel} />
                                )}
                            </div>
                        }
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.CardActions} disableSpacing>
                    <Button color='secondary' onClick={openProject} className={classes.CardProject}>{project.name}</Button>
                    <IconButton color='secondary' onClick={openIssue}>
                        <Edit />
                    </IconButton>
                    <IconButton color='secondary' onClick={handleDeleteConfirmation}>
                        <DeleteForever />
                    </IconButton>
                </CardActions>
            </Card>
            <DeleteConfirmationDialog
                title={title}
                status={state.deleteConfirmationUI}
                onDelete={handleDelete}
                onCancel={handleDeleteCanceled} />
        </React.Fragment>
    );
}
