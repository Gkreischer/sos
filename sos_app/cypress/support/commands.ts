// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<void>;
  }
}

//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.session('admin', () => {
    cy.visit('/login');

    cy.intercept('POST', '**/login').as('login');

    cy.get('#input-email input').type('admin@localhost');
    cy.get('#input-password input').type('teste123');
    cy.get('#login-button').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '/home');
  });
});

// Configurações globais
Cypress.config({
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  includeShadowDom: true,
});
