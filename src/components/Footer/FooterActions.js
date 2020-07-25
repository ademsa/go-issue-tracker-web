import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { AddRounded, ArrowUpward, BugReport, Description, Label } from '@material-ui/icons';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';

const useStyles = makeStyles((theme) => ({
    SpeedDial: {
        position: 'absolute',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    },
    TooltipLabel: {
        color: theme.palette.secondary.main,
    }
}));

export default function FooterActions() {
    const classes = useStyles();

    const [state, setState] = useState(false);
    const stateChanged = (_, reason) => {
        if (reason === 'mouseEnter') {
            setState(true);
        } else {
            setState(false);
        }
    }

    const history = useHistory()
    const handleActionClick = (event) => {
        history.push('/' + event.currentTarget.dataset.type + '/new');
    }

    return (
        <React.Fragment>
            <SpeedDial
                ariaLabel='Add'
                onOpen={stateChanged}
                onClose={stateChanged}
                open={state}
                className={classes.SpeedDial}
                icon={<SpeedDialIcon icon={<AddRounded color='secondary' />} openIcon={<ArrowUpward color='secondary' />} />}>
                <SpeedDialAction key='issues' icon={<BugReport color='secondary' />} tooltipOpen tooltipTitle='Issue' classes={{ staticTooltipLabel: classes.TooltipLabel }} data-type={'issues'} onClick={handleActionClick} />
                <SpeedDialAction key='projects' icon={<Description color='secondary' />} tooltipOpen tooltipTitle='Project' classes={{ staticTooltipLabel: classes.TooltipLabel }} data-type={'projects'} onClick={handleActionClick} />
                <SpeedDialAction key='labels' icon={<Label color='secondary' />} tooltipOpen tooltipTitle='Label' classes={{ staticTooltipLabel: classes.TooltipLabel }} data-type={'labels'} onClick={handleActionClick} />
            </SpeedDial>
        </React.Fragment>
    );
}
