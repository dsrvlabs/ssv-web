import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    GridItem: {
        height: 74,
        marginBottom: theme.spacing(5),
        '&:last-of-type': {
            marginBottom: 39,
        },
    },
    TextError: {
        color: 'red',
        zIndex: 9123123,
        fontSize: '0.8rem',
    },
}));
