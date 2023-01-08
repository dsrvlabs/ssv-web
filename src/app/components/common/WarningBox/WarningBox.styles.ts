import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  Wrapper: {
    gap: 10,
    height: 47,
    fontSize: 14,
    borderRadius: 2,
    fontWeight: 500,
    lineHeight: 1.62,
    padding: '12px 16px',
    alignItems: 'center',
    color: theme.colors.gray90,
    justifyContent: 'flex-start',
    border: `solid 1px ${theme.colors.warning}`,
    backgroundColor: theme.colors.primaryWarningRegular,
  },
}));
