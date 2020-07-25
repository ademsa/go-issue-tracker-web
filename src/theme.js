import { createMuiTheme } from '@material-ui/core/styles';
import { green, indigo, red, common } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
        action: {
            active: common.black,
            selected: green[500],
        },
        primary: {
            main: indigo.A400,
            contrastText: common.white,
        },
        secondary: {
            main: green.A400,
            contrastText: common.white,
        },
        success: {
            main: green[500],
            contrastText: common.white,
        },
        error: {
            main: red[500],
            contrastText: common.white,
        },
        background: {
            default: indigo[50],
            paper: indigo[900],
        },
        text: {
            primary: common.white,
            secondary: indigo.A400,
            disabled: indigo[500],
            hint: indigo[500],
        }
    },
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: indigo[900],
            }
        },
        MuiDialogContentText: {
            root: {
                color: green.A400,
            }
        },
        MuiFormHelperText: {
            root: {
                color: indigo.A400,
            }
        },
        MuiTypography: {
            colorTextSecondary: {
                color: green.A400,
            }
        },
        MuiButton: {
            contained: {
                backgroundColor: indigo.A400,
                '&:hover': {
                    backgroundColor: indigo[500],
                },
                color: common.white,
            }
        },
        MuiOutlinedInput: {
            root: {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: indigo.A400,
                },
            },
            notchedOutline: {
                borderColor: indigo[200],
            }
        },
    }
})

export default theme;