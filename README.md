
<div align="center">


[comment]: <> (download)
![Downloads][github-releases-download]
[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]
[![Discord](https://discord.com/api/guilds/723834989506068561/widget.png?style=shield)](http://bit.ly/30HwvsC)
</div>
<br>


# SSV - Secret Shared Validator
In order to supply a truly secure layer of your validator node, we're offering more decentralization! <br>
The solution that we provide is called <a href="https://github.com/herumi/bls-wasm">Secret Share Validator</a>, and it's split into 2 sections


### Add Validator
From a validator perspective, getting penalties (e.g., for inactivity) or worse - getting permanently slashed - must be avoided at all costs.
The solution that we provide is to break the validator private keys into (N) shares using 
<a href="https://github.com/herumi/bls-wasm">Shamir Secret Share</a>, out of those shares we create for each share <br> private & public key using 
<a href="https://github.com/herumi/bls-wasm">BLS Signature</a>. When registering a validator, the user must select the amount of shares,
and the specific operators on which the shares will run. Each share is encrypted with its respective operator key.
After the operators receive the shares they start to collaborate in order to aggregate signatures to reach the full validator signature.<br>
Our solution prevents the single point of failure issue which poses a major risk when depending on a single node.

### Add Operator
The term "Operator" is our invention for people who don't want to put a collateral of 32 ETH but still want to participate in blockchain and receive rewards.<br>
All you need to do is to run the operator node using <a herf="https://github.com/bloxapp/ssv">SSV-NODE</a> take the public key from it and register as operator.
### Cli
Another option we support is a CLI, all you need to do is to run the following command with the relevant arguments, and you receive a full translation data
```
yarn link
```
```
ssv-cli --filePath=<keyStore> --password=<ketStore password> --operators="< base64 operators keys seperated with comma >" (4 operators require)
```
```shell
ssv-cli --filePath=/Users/guymuroch/Downloads/keystores/keystore-m_12381_3600_65_0_0-1629639090.json --password=12345678 --operators="LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBb3dFN09FYnd5TGt2clowVFU0amoKb295SUZ4TnZnclk4RmorV3NseVpUbHlqOFVEZkZyWWg1VW4ydTRZTWRBZStjUGYxWEsrQS9QOVhYN09CNG5mMQpPb0dWQjZ3ckMvamhMYnZPSDY1MHJ5VVlvcGVZaGxTWHhHbkQ0dmN2VHZjcUxMQit1ZTIvaXlTeFFMcFpSLzZWCnNUM2ZGckVvbnpGVHFuRkN3Q0YyOGlQbkpWQmpYNlQvSGNUSjU1SURrYnRvdGFyVTZjd3dOT0huSGt6V3J2N2kKdHlQa1I0R2UxMWhtVkc5UWpST3Q1NmVoWGZGc0ZvNU1xU3ZxcFlwbFhrSS96VU5tOGovbHFFZFUwUlhVcjQxTAoyaHlLWS9wVmpzZ21lVHNONy9acUFDa0h5ZTlGYmtWOVYvVmJUaDdoV1ZMVHFHU2g3QlkvRDdnd093ZnVLaXEyClR3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZ78787871,LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBbFdUb0xqU1FLVDQ1b1pLOHZWUDcKeHlrc3ZpZlRQTG9RUzBMSmFnTkxHUWxPRXhJR3VsZUNaMit3cDlJZnd5NzdCTHk2eHhsZTNDZWIwdmdzbmRrcgpzUFk3dFFFTEVVNWVmZThDV2k3aGxOelE0ZHlrd2VZYlpNY3hZMlRtcGMvZFhNbVhmajNEZ1FWemd2WVVXcDI4ClJSSHdNMHk4RVVsdVF1R1BzTTNBRG5nYnJET3JHVnoxam5CNjJNRElaOHlLTklweWFhZEF5dXp2RGQ2N055RmwKWmROSWx4bHk2UG8xd09nL0JvQU5HM29wUGFJWnR2QmI3eGV6Z01seHVkRFk0T3ltMUtnREg1QVQ2ak1XSU9CTQozTWZnUjN3TEdqbXBMTS9YRklid2ZmVzFxYzRodjNoWHpxQWFhTjF1Rk5UVC82YUk5RktsMGN2NjRPWjBRUnkrCmR3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K,LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBclVWUGt6OFltcm1TVWZPOUpnNzQKWk9ER1l1cEdFQVpZaE1qZlVBTGplcmdNZlIxU2l2bTFlR2QyVytGUkxJeXZmcUo3b0RkS1Z0UTBDcGExRmgzbwpjcUtIUzIwTU85OWkvWVE0aUZ1MnMzOGNoUllDVndnbUdrMHVFQUlZamRoRWRWcWVRa2RSTHQ4NXdHTS95dE1FCkJVTCtEVE1sejNkWitxWGlGb3JnUHJMenFkSVFhS3RCQXZVV29HUVNkL1RZSVplQXVRdGNkZU43bVh4S05sWGMKRENZelRYcWVlNXlWMEk2cE5ud1QvS3l4SXNFY3RIenF4QXQ1dDJhdy9ldytJbTFZZlZYVlV2emtrbFo3aCt2Twp4Q3plUjRWc21JRVUybUpSQlJMYjB2RU95VXhMR2RJOVRmSzBwR0hCYWVEM2ZDM0lwWkJ5Qmg1OEgwTjlEMlYvCkx3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K,LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcVZ2NTJTL203SUM4RU9SNWF0TDgKQU12bGdZOE01Tnd6MGI1ckEwb084V0ZFTjEveGpVQ282U25hTkxXSUh3YUF2U0VFV2ZZTGZtSmMyd3MzMmxQWgp4aUp6MnVWcXJFWm4yMGVFZ0p0anIrNkxtbHdsWCtXdzdhVnJpcjFJVWVXWlJZTUcySGdzWk5sZC9ERjRJYm4zCmdJdmtja3Y1YnhhWTFPQjUvdlpHcUpYY3lrTWl0L0d4WExNR0tKWlNETDFGanRzZEdjaXQ1K2d0Ukc5Yi8yemcKMEJQR0dvYTlTOWNIekRvNmVhaTREOTZzS2l6RW4vUmhFM2Z3OHgwT2htNXYxZHJlRWpLNHQ1SU5uOUJvMDdTRQpleVhIVGV5UEJHSnBDQ2gxcWxUL2RFUVo1NWxyVW5MUnpGMk1NTUlMUXZZZWV0aEIvbTBuTzB3VTBzTGdHeUhQClJ3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K"
```

### Testing

#### Functional Tests

`yarn test` - no watching mode

`yarn test:dev` - run tests in watch mode

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### E2E Tests

##### Unzip dependencies

```
unzip cypress/plugins/MetaMask/metamask-chrome-9.5.0.zip
```

```
unzip cypress/integration/ssv/cli/eth2.0-deposit-cli-master.zip
```

##### Install deposit CLI dependencies

For the virtualenv users, you can create a new venv:

```
cd cypress/integration/ssv/cli/eth2.0-deposit-cli-master
pip3 install virtualenv
virtualenv .venv
source .venv/bin/activate
```

and install the dependencies:

```
python3 setup.py install
pip3 install -r requirements.txt
pip3 install pytest
```

Check that tests are passing before starting using deposit CLI for auto-generation of keystore files during running cypress:

```
cd cypress/integration/ssv/cli/eth2.0-deposit-cli-master
source .venv/bin/activate
python3 -m pytest .
```

### Building

`yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Linting

`yarn lint`

Lint checks works on every change of source code.

Also, lint happens before developer tries to commit (husky package).

### Git Commits

As said upper, on every commit attempt husky runs linter to check source code.

### Git Pushes

## Tech Stack
- <a href="https://web3js.readthedocs.io/en/v1.3.4/">Web3.js</a> - BlockChain integration for Web2
- <a href="https://github.com/blocknative/onboard">Onboard</a> - Integration tool to wallets
- <a href="https://reactjs.org/">React 16.8</a> - To handle front end tasks in scale
- <a href="https://reacttraining.com/react-router/web/guides/quick-start">React Router</a> - For application navigation and routing
- <a href="https://mobx.js.org/README.html">Mobx</a> - A UI state management and middleware to handle async operations
- <a href="https://material-ui.com/">Material UI</a> - A React library to make styling more dynamic and easy
- <a href="https://www.typescriptlang.org/">TypeScript</a> and <a href="https://eslint.org/">ESlint</a> - For better development experience, linting errors, type checking, auto complete and more
- <a href="https://jestjs.io/">Jest JS</a> and <a href="https://reactjs.org/docs/test-renderer.html">React Test Renderer</a> - Testing tools for React applications

## Docs (TBD)

See our [docs and guides here](https://www.bloxstaking.com/blox-blog/)

## Maintainers
- [Demitri Meshin](https://github.com/meshin-blox)
- [Guy Muroch](https://github.com/guym-blox)
- [Lior Rutenberg](https://github.com/lior-blox)

## License

GPLv3 © [Blox SSV](https://github.com/bloxapp/ssv-web)

[github-actions-status]: https://github.com/bloxapp/ssv-web/workflows/Test/badge.svg?branch=stage
[github-releases-download]: https://img.shields.io/github/downloads/guym-blox/ssv-web/total
[github-actions-url]: https://github.com/bloxapp/ssv-web/actions
[github-tag-image]: https://img.shields.io/github/v/tag/bloxapp/ssv-web.svg?label=version
[github-tag-url]: https://github.com/bloxapp/blox-live.svg/releases/latest
[david-dev-image]: https://david-dm.org/bloxapp/blox-live/stage/dev-status.svg
[david-dev-url]: https://david-dm.org/bloxapp/blox-live/stage?type=dev	
