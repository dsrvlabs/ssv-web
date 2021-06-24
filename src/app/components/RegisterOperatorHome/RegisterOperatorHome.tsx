import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Typography from '@material-ui/core/Typography';
import { Link as MaterialLink } from '@material-ui/core';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import UnStyledLink from '~app/common/components/UnStyledLink';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ConditionalLink from '~app/common/components/ConditionalLink';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const OrganicLink = UnStyledLink(MaterialLink);

const RegisterOperatorHome = () => {
  const classes = useStyles();
  const history = useHistory();
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;

  const redirectToGenerateKeys = async () => {
     await walletStore.connect();
     if (walletStore.connected) {
      history.push(config.routes.OPERATOR.GENERATE_KEYS);
    }
  };

  return (
    <Screen 
      navigationText={translations.HOME.TITLE}
      navigationLink={config.routes.HOME}
      title={translations.OPERATOR.HOME.TITLE}
      subTitle={translations.OPERATOR.HOME.DESCRIPTION}
      body={(
        <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <OrganicLink href={config.links.LINK_SSV_DEV_DOCS} target="_blank">
              <Paper className={classes.guideStepsContainerPaper}>
                <Grid container wrap="nowrap" spacing={1}>
                  <Grid item md={8} xs={8}>
                    <Typography noWrap variant="h6" className={classes.guideStepText}>Run SSV Node</Typography>
                    <Typography noWrap variant="caption">See our developer documentation</Typography>
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <ArrowForwardIosIcon className={classes.arrowIcon} />
                  </Grid>
                </Grid>
              </Paper>
            </OrganicLink>
          </Grid>

          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <ConditionalLink to={config.routes.OPERATOR.GENERATE_KEYS} condition={walletStore.connected} onClick={redirectToGenerateKeys}>
              <Paper className={classes.guideStepsContainerPaper}>
                <Grid container wrap="nowrap" spacing={1}>
                  <Grid item md={8} xs={8}>
                    <Typography noWrap variant="h6" className={classes.guideStepText}>Register operator</Typography>
                    <Typography noWrap variant="caption">List yourself as one of the network operators</Typography>
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <ArrowForwardIosIcon className={classes.arrowIcon} />
                  </Grid>
                </Grid>
              </Paper>
            </ConditionalLink>
          </Grid>
        </Grid>
      )}
      />
  );
};

export default observer(RegisterOperatorHome);
