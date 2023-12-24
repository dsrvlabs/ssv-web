import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  BadgeCounterWrapper: {
    width: 26,
    height: 26,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: (props: any) => props.hasMevRelays ? theme.colors.tint90 : theme.colors.gray10,
    color: (props: any) => props.hasMevRelays ? theme.colors.primaryBlue : theme.colors.gray40,
    border: (props: any) => `1px solid ${props.hasMevRelays ? theme.colors.primaryBlue : theme.colors.gray40}`,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
  },
  MevRelaysPopUp: {
    width: 526,
    alignItems: 'center',
    position: 'absolute',
    top: (props: any) => props.popUpTop,
    padding: '20px',
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    boxShadow: '0 3px 12px 0 rgba(0, 0, 0, 0.06)',
    zIndex: 9999999,
  },
  MevRelaysTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.black,
  },
  MevRelaysContainer: {
    gap: 6,
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  MevRelayBadge: {
    borderRadius: 8,
    padding: '6px 12px 6px 12px',
    backgroundColor: theme.colors.gray10,
    display: 'flex',
  },
  MevRelayLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: (props: any) => `url(/images/mevs/${props.mevRelayLogo}.svg)`,
  },
  MevIconWrapper: {
    width: 14,
    height: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: (props: any) => props.hasMevRelay ? theme.colors.tint90 : theme.colors.gray10,
    color: (props: any) => props.hasMevRelay ? theme.colors.primaryBlue : theme.colors.gray40,
    border: (props: any) => `1px solid ${props.hasMevRelay ? theme.colors.primaryBlue : theme.colors.gray40}`,
    borderRadius: 3,
  },
  MevIcon: {
    width: 8,
    height: 8,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: (props: any) => props.hasMevRelay ? 'none' : '40%',
    backgroundImage: (props: any) => `url(/images/mevs/${props.mevIcon}${theme.darkMode ? '-dark' : ''}.svg)`,
  },
  MevRelayBadgeText: { fontSize: 14, fontWeight: 500 },
}));