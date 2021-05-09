/// <reference types="cypress" />
/* eslint-disable no-undef */
import crypto from 'crypto';
import config, { translations } from '~app/common/config';

const randomValueHex = (len) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len);
};

const operatorPublicKeyLength = 42;

const baseUrl = 'http://localhost:3000';

context('Add Validator', () => {
  before(() => {
    cy.visit(baseUrl);
  });

  it('should navigate to operator screen', () => {
    cy.get(`[data-testid="${config.routes.OPERATOR.START}"]`).click();

    cy.get('[data-testid=header-title]')
      .should('contain.text', translations.OPERATOR.HOME.TITLE);

    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq(`${baseUrl}${config.routes.OPERATOR.START}`);
      expect(location.pathname).to.eq(config.routes.OPERATOR.START);
      expect(location.search).to.be.empty;
    });
  });

  it('should navigate to register new operator screen', () => {
    const registerOperatorSelector = `[data-testid="${config.routes.OPERATOR.GENERATE_KEYS}"]`;
    cy.waitFor(registerOperatorSelector);
    cy.get(registerOperatorSelector).click();

    cy.get('[data-testid=header-title]')
      .should('contain.text', translations.OPERATOR.REGISTER.TITLE);

    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq(`${baseUrl}${config.routes.OPERATOR.GENERATE_KEYS}`);
      expect(location.pathname).to.eq(config.routes.OPERATOR.GENERATE_KEYS);
      expect(location.search).to.be.empty;
    });
  });

  it('should fill up operator data with errors', () => {
    const operatorName = 'TestOperator: 123';
    cy.get('[data-testid=new-operator-name]').type(`${operatorName}`);
    cy.get('[data-testid=new-operator-key]').type(`${randomValueHex(operatorPublicKeyLength + 1)}`);
    cy.get('[data-testid="terms-checkbox"]').click();
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid="terms-checkbox"]').click();
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name should contain only alphanumeric characters.');
    cy.get('[data-testid=new-operator-name]').clear().type('A');
    cy.get('[data-testid=new-operator-key]').clear().type('A');
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name must be between 3 to 20 characters.');
    cy.get('[data-testid=new-operator-key]').parent().should('contain.text', 'Invalid operator key - see our documentation to generate your key.');
  });

  it('should fill up operator data without errors', () => {
    cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
    cy.get('[data-testid=new-operator-key]').clear().type(`${randomValueHex(operatorPublicKeyLength)}`);
    cy.get('[data-testid="terms-checkbox"]').click();
    cy.get('[data-testid="register-operator-button"]').should('be.enabled');
  });

  it('should open Onboard.js provider dialog, select MetaMask and wait for user input', () => {
    cy.get('[data-testid="register-operator-button"]').click();

    // if (!process.env.TEST_HEADLESS) {
    //   cy.get('.bn-onboard-modal-content-header-heading').should('contain.text', 'Select a Wallet');
    //   cy.get('.bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom').click();
    //   cy.pause();
    //   cy.waitFor('.MuiAlert-message');
    //   cy.get('.MuiAlert-message').should('contain.text', 'You successfully added operator!');
    // }
  });
});
