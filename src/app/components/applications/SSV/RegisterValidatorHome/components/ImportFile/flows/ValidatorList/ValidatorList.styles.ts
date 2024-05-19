import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  TableWrapper: {
    width: 584,
    height: 504,
    border: `1px solid ${theme.colors.gray30}`,
    borderRadius: 8,
    overflowY: 'auto',
    marginBottom: 32,
    // backgroundColor: 'red',
  },
  TableHeader: {
    height: 36,
    width: '100%',
    padding: '9px 0px 9px 20px',
    borderBottom: `1px solid ${theme.colors.gray30}`,
  },
  HeaderText: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.colors.gray40,
  },
  ValidatorSlotWrapper: {
    width: '100%',
    height: 44,
    border: `1px solid ${theme.colors.gray20}`,
    padding: '9px 20px 9px 20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  SelectedValidatorSlot: {
    backgroundColor: theme.colors.tint90,
    border: `1px solid ${theme.colors.primaryBlue}`,
  },
  ErrorValidatorSlot: {
    border: '1px solid rgba(236, 28, 38, 0.32)',
    backgroundColor: 'rgba(236, 28, 38, 0.03)',
  },
  ValidatorKeyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.gray90,
    gap: 8,
  },
  RegisteredBadge: {
    padding: '1px 8px 1px 8px',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primarySuccessRegularOpacity,
    color: theme.colors.primarySuccessDark,
    borderRadius: 4,
  },
  ErrorBadge: {
    padding: '1px 8px 1px 8px',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 28, 38, 0.03)',
    color: theme.colors.primarySuccess,
    borderRadius: 4,
  },
  ValidatorCounterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  CounterButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    fontSize: 30,
    justifyContent: 'center',
    backgroundColor: theme.colors.tint80,
  },
  MinusIcon: {
    width: 16,
    height: 16,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/bulk-counter/minus.svg)',
  },
  CounterWrapper: {
    width: 60,
    height: 40,
    border: `1px solid ${theme.colors.primaryBlue}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    color: theme.colors.gray90,
  },
  InnerInput: {
    width: '100%',
    border: 'none',
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.gray90,
    textAlign: 'center',
    backgroundColor: 'transparent',
    '&:focus' : {
      border: 'none !important',
    },
  },
  PlusIcon: {
    width: 16,
    height: 16,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/images/bulk-counter/plus.svg)',
  },
  DisabledPlus: {
    backgroundImage: 'url(/images/bulk-counter/disabled-plus.svg)',
  },
  DisabledMinus: {
    backgroundImage: 'url(/images/bulk-counter/disabled-minus.svg)',
  },
  DisabledButton: {
    backgroundColor: theme.colors.gray20,
  },
}));