import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import SelectOperators from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from './EditValidator.styles';

const EditValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const myAccountStore: MyAccountStore = stores.MyAccount;
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        if (!validatorStore.processValidatorPublicKey) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        applicationStore.setIsLoading(true);
        myAccountStore.getValidator(validatorStore.processValidatorPublicKey).then((response: any) => {
            if (response) {
                operatorStore.selectOperators(response?.operators);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    return (
      <Grid container className={classes.EditValidatorWrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <SelectOperators editPage />
      </Grid>
    );
};
export default observer(EditValidator);