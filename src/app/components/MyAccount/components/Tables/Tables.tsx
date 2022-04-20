import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Operator from '~lib/api/Operator';
import Validator from '~lib/api/Validator';
import ApiParams from '~lib/api/ApiParams';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import DataTable from '~app/common/components/DataTable/DataTable';
import Rows from '~app/components/MyAccount/common/componenets/Rows';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { useStyles } from '~app/components/MyAccount/components/Tables/Tables.styles';

const operatorHeaderInit = ['Public Key', 'Status', 'Revenue', 'Validators', ''];

const Tables = () => {
    const stores = useStores();
    const classes = useStyles();
    const defaultOperators: any[] = [];
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [operators, setOperators] = useState(defaultOperators);
    const [validators, setValidators] = useState(defaultOperators);
    const [loadingOperators, setLoadingOperators] = useState(true);
    const [loadingValidators, setLoadingValidators] = useState(true);
    const [operatorsPagination, setOperatorsPagination] = useState(ApiParams.DEFAULT_PAGINATION);
    const [validatorsPagination, setValidatorsPagination] = useState(ApiParams.DEFAULT_PAGINATION);

    // @ts-ignore
    useEffect(async () => {
        async function fetchData() {
            await loadItems('validators');
            await loadItems('operators');
        }
        if (walletStore.accountAddress) {
            fetchData();
            // console.log('<<<<<<<<<here>>>>>>>>>');
            // console.log(operators.length);
            // console.log(validators.length);
            // console.log('<<<<<<<<<here>>>>>>>>>');
        }
    }, [walletStore.accountAddress]);
    /**
     * Loading operators by page
     * @param type
     * @param paginationPage
     */
    async function loadItems(type: string, paginationPage?: number) {
        if (paginationPage) {
            ApiParams.saveInStorage(type, 'page', paginationPage);
        }

        const page: number = ApiParams.getInteger(type, 'page', 1);
        const perPage: number = ApiParams.getInteger(type, 'perPage', ApiParams.PER_PAGE);

        if (type === 'operators') {
            setLoadingOperators(true);
            const result = await Operator.getInstance().getOperatorsByOwnerAddress(page, perPage, walletStore.accountAddress);
            setOperators(result.operators);
            setOperatorsPagination(result.pagination);
            setLoadingOperators(false);
        } else {
            setLoadingValidators(true);
            const result = await Validator.getInstance().getValidatorsByOwnerAddress(page, perPage, walletStore.accountAddress);
            if (result.validators.length > 0) ssvStore.userState = 'validator';
            setValidators(result.validators);
            setValidatorsPagination(result.pagination);
            setLoadingValidators(false);
        }
    }

    /**
     * When per page dropdown changed
     * @param type
     * @param perPage
     */
    function onChangeRowsPerPage(type: string, perPage: number) {
        ApiParams.saveInStorage(type, 'perPage', perPage);
        loadItems(type, 1);
    }

    const operatorsRows = Rows({
        items: operators,
        shouldDisplayStatus: true,
        shouldDisplayValidators: true,
    });

    const validatorsRows = Rows({
        items: validators,
        shouldDisplayStatus: true,
        shouldDisplayValidators: true,
    });

    return (
      <Grid container item className={classes.Table}>
        {operators.length > 0 && (
          <Grid item xs={12} style={{ marginBottom: 20 }}>
            <DataTable
              type={'operators'}
              title={'Operators'}
              items={operatorsRows}
              onChangePage={loadItems}
              isLoading={loadingOperators}
              headers={operatorHeaderInit}
              totalPages={operatorsPagination.pages}
              currentPage={operatorsPagination.page}
              onChangeRowsPerPage={onChangeRowsPerPage}
              totalAmountOfItems={operatorsPagination.total}
              perPage={ApiParams.getInteger('operators', 'perPage', ApiParams.PER_PAGE)}
            />
          </Grid>
        )}
        {validators.length > 0 && (
          <Grid item xs style={{ marginBottom: 20 }}>
            <DataTable
              type={'validators'}
              title={'Validators'}
              items={validatorsRows}
              onChangePage={loadItems}
              headers={operatorHeaderInit}
              isLoading={loadingValidators}
              totalPages={validatorsPagination.pages}
              currentPage={validatorsPagination.page}
              onChangeRowsPerPage={onChangeRowsPerPage}
              totalAmountOfItems={validatorsPagination.total}
              perPage={ApiParams.getInteger('validators', 'perPage', ApiParams.PER_PAGE)}
            />
          </Grid>
        )}
      </Grid>
    );
};

export default React.memo(observer(Tables));