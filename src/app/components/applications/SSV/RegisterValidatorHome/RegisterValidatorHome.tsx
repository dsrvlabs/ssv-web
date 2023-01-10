import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/common/BorderScreen';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/RegisterValidatorHome.styles';
import Typography from '@material-ui/core/Typography';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import LinkText from '~app/components/common/LinkText';

const RegisterValidatorHome = () => {
  const classes = useStyles();
  const stores = useStores();
  const navigate = useNavigate();
  const validatorStore: ValidatorStore = stores.Validator;

  const preRequisites = [
      'An active Ethereum validator (deposited to Beacon Chain)',
      'SSV tokens to cover operational fees',
  ];

  useEffect(() => {
      validatorStore.clearValidatorData();
  });

  return (
    <BorderScreen
      body={[
        <Grid container>
          <HeaderSubHeader title={'Run Validator with the SSV Network'}
            subtitle={'Distribute your validation duties among a set of distributed nodes to improve your validator resilience, safety, liveliness, and diversity.'}
          />
          <Typography className={classes.GrayText}>PreRequisites</Typography>
          <Grid container item style={{ gap: 8, marginBottom: 24 }}>
            {preRequisites.map((preRequisite: string, index: number)=>{
              return <Grid container item key={index} style={{ alignItems: 'center', gap: 14 }}>
                <Grid item className={classes.GreenV}></Grid>
                <Typography className={classes.Text}>{preRequisite}</Typography>
              </Grid>;
            })}
          </Grid>
          <PrimaryButton text={'Next'} submitFunction={()=> navigate(config.routes.SSV.VALIDATOR.SELECT_OPERATORS)} withoutLoader/>
          <Grid container item style={{ marginTop: 16, gap: 4 }}>
            <Typography className={`${classes.GrayText} ${classes.Gray90Text}`}>Don't have a validator?</Typography>
            <LinkText text={'Create via Ethereum Launchpad'}/>
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(RegisterValidatorHome);
