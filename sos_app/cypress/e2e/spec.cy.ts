describe('App is loaded', () => {
  describe('Login Tests', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should redirect to login when accessing home without authentication', () => {
      cy.visit('/home');
      cy.url().should('include', '/login');
    });

    it('should disable login button when no inputs are filled', () => {
      cy.get('#login-button').shadow().find('button').should('be.disabled');
    });

    it('should enable login button when valid inputs are provided', () => {
      cy.get('#input-email').find('input').type('test@test.com');
      cy.get('#input-password').find('input').type('12345678');
      cy.get('#login-button').shadow().find('button').should('not.be.disabled');
    });

    it('should disable login button when invalid email is provided', () => {
      cy.get('#input-email').find('input').type('test');
      cy.get('#input-password').find('input').type('123456');
      cy.get('#login-button').shadow().find('button').should('be.disabled');
    });

    it('should display authentication error for invalid credentials', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { message: 'Unauthorized' },
      }).as('login');

      cy.get('#input-email').find('input').type('test@test.com');
      cy.get('#input-password').find('input').type('12345678');
      cy.get('#login-button').click();

      cy.wait('@login').its('response.statusCode').should('eq', 401);

      // Verificação do erro na UI
      cy.get('ion-toast[color="danger"]').should('exist');
    });

    it('should successfully login with valid credentials', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token' },
      }).as('login');

      cy.get('#input-email').find('input').type('valid@test.com');
      cy.get('#input-password').find('input').type('password123');
      cy.get('#login-button').click();

      cy.wait('@login').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/home');
    });
  });

  describe('Home Tests', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/');
    });

    it('should navigate to home page successfully', () => {
      cy.url().should('include', '/home');
      cy.get('[data-cy="home-page"]').should('be.visible');
    });

    it('should display sidebar menu when button is clicked', () => {
      cy.get('ion-menu-button').click();
      cy.get('ion-menu[menu-id="main"]').should('exist').and('be.visible');

      // Verificação de elementos do menu
      cy.get('[data-cy="menu-item-home"]').should('be.visible');
      cy.get('[data-cy="menu-item-profile"]').should('be.visible');
    });
  });

  describe('Categories Tests', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/categorias');
    });

    it('should navigate to categories page successfully', () => {
      cy.url().should('include', '/categorias');
      cy.get('[data-cy="categories-page"]').should('be.visible');
    });

    it('should display categories list with at least one item', () => {
      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
        ],
      }).as('getCategories');

      cy.wait('@getCategories').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy="categories-list"]').should('exist');

      cy.get('[data-cy="categories-list"] ion-item').should(
        'have.length.at.least',
        1,
      );
    });

    it('should display add button for new categories', () => {
      cy.get('ion-fab').should('exist');
      cy.get('ion-fab').should('be.visible');
    });

    it('should handle empty categories list gracefully', () => {
      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [],
      }).as('getEmptyCategories');

      cy.wait('@getEmptyCategories');
      cy.get('[data-cy="empty-categories-message"]').should('be.visible');
    });

    it('should open the modal to add a new category', () => {
      cy.get('ion-fab').click();
      cy.get('[data-cy="add-category-modal"]').should('be.visible');
    });

    it('should add a new category successfully', () => {
      cy.intercept('POST', '**/categories', {
        statusCode: 201,
        body: { name: 'Category 1' },
      }).as('addCategory');

      cy.get('ion-fab').click();
      cy.get('[data-cy="add-category-modal"]').should('be.visible');

      cy.get('ion-input[formControlName="name"')
        .find('input')
        .type('Category 1');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@addCategory').its('response.statusCode').should('eq', 201);
      cy.get('[data-cy="categories-list"]').should('exist');

      cy.get('[data-cy="categories-list"] ion-item').should(
        'have.length.at.least',
        2,
      );

      cy.get('[data-cy="add-category-modal"]').should('not.exist');
    });

    beforeEach(() => {
      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Category 1',
          },
        ],
      }).as('getCategories');
    });

    it('should update a category successfully', () => {
      cy.intercept('PUT', '**/categories/1', {
        statusCode: 200,
        body: { id: 1, name: 'Category 1 - Updated' },
      }).as('updateCategory');

      cy.get('[data-cy="categories-list"] ion-item')
        .contains('Category 1')
        .click();

      cy.get('[data-cy="add-category-modal"]').should('be.visible');

      cy.get('ion-input[formControlName="name"]')
        .find('input')
        .clear()
        .type('Category 1 - Updated');

      cy.get('ion-button[type="submit"]').click();

      cy.wait('@updateCategory').its('response.statusCode').should('eq', 200);

      cy.get('[data-cy="categories-list"]').should('exist');

      cy.get('[data-cy="categories-list"] ion-item').should(
        'have.length.at.least',
        1,
      );

      cy.get('[data-cy="add-category-modal"]').should('not.exist');
    });

    it('should delete a category successfully', () => {
      cy.intercept('DELETE', '**/categories/1', {
        statusCode: 204,
      }).as('deleteCategory');

      cy.get('[data-cy="categories-list"] ion-item').eq(0).click();
      cy.get('[data-cy="add-category-modal"]').should('be.visible');

      cy.get('ion-fab-button[color="danger"]').click();
      cy.get('.alert-modal').should('exist');

      cy.get('#confirm-button').click();

      cy.wait('@deleteCategory').its('response.statusCode').should('eq', 204);

      cy.get('[data-cy="categories-list"]').should('exist');

      cy.get('[data-cy="categories-list"] ion-item').should(
        'have.length.at.least',
        1,
      );
      cy.get('[data-cy="add-category-modal"]').should('not.exist');
    });
  });

  describe('Equipments Tests', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/equipments/filter', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Equipamento 1',
              description: 'Descrição do equipamento 1',
              category_id: 1,
              user_id: 1,
              user: {
                id: 1,
                name: 'Cliente 1',
              },
              category: {
                id: 1,
                name: 'Categoria 1',
              },
              obs: 'Observação do equipamento 1',
            },
            {
              id: 2,
              name: 'Equipamento 2',
              description: 'Descrição do equipamento 2',
              category_id: 2,
              category: {
                id: 2,
                name: 'Categoria 2',
              },
              user_id: 2,
              user: {
                id: 2,
                name: 'Cliente 2',
              },
              obs: 'Observação do equipamento 2',
            },
          ],
          per_page: 20,
          total: 2,
          last_page: 1,
        },
      }).as('getEquipments');

      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Categoria 1' },
          { id: 2, name: 'Categoria 2' },
        ],
      }).as('getCategories');

      cy.intercept('POST', '**/users?page=1', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Cliente 1',
              type_id: 1,
              type: {
                id: 1,
                name: 'Cliente',
              },
              phone: '123456789',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getUsers');

      cy.login();
      cy.visit('/equipamentos');

      cy.wait('@getEquipments');
    });

    it('should navigate to equipments page successfully', () => {
      cy.url().should('include', '/equipamentos');
      cy.get('[data-cy="equipments-page"]').should('be.visible');
    });

    it('should display equipments list with at least one item', () => {
      cy.get('[data-cy="equipments-list"]').should('exist');

      cy.get('[data-cy="equipments-list"] ion-item').should(
        'have.length.at.least',
        1,
      );
    });

    it('should display add button for new equipments', () => {
      cy.get('ion-fab').should('be.visible');
    });

    it('should open the modal to add a new equipment', () => {
      cy.get('ion-fab-button').click();

      cy.get('[data-cy="equipment-modal"]').should('be.visible');

      cy.wait('@getCategories');

      cy.get('[data-cy="close-modal"]').click();

      cy.get('[data-cy="equipment-modal"]').should('not.exist');
    });

    it('should add a new equipment successfully', () => {
      cy.intercept('POST', '**/equipments', {
        statusCode: 201,
        body: { id: 3, name: 'Equipamento 3' },
      }).as('addEquipment');

      cy.get('ion-fab-button').click();

      cy.wait('@getCategories');

      cy.get('[data-cy="equipment-modal"]').should('be.visible');

      cy.get('ion-input[formControlName="name"]')
        .find('input')
        .type('Equipamento teste');

      cy.get('ion-input[formControlName="user_name"]').find('input').click();

      cy.wait('@getUsers');

      cy.get('ion-list[data-cy="users-list"] ion-item').eq(0).click();

      cy.get('ion-select[formControlName="category_id"]').click();

      cy.get('.alert-radio-button')
        .should('have.length.at.least', 1)
        .first()
        .click();

      cy.get('.alert-button:not(.alert-button-role-cancel)').click();

      cy.get('ion-alert').should('not.exist');

      cy.get('[data-cy="equipment-modal"]')
        .find('textarea.native-textarea')
        .first()
        .type('Descrição do equipamento 3', { force: true });

      cy.get('[data-cy="equipment-modal"] ion-button[type="submit"]').click();

      cy.wait('@addEquipment').its('response.statusCode').should('eq', 201);
    });

    it('should update a equipment successfully', () => {
      cy.intercept('PUT', '**/equipments/*', {
        statusCode: 200,
        body: { id: 1, name: 'Equipamento 1 - Updated' },
      }).as('updateEquipment');

      cy.get('[data-cy="equipments-list"] ion-item').first().click();

      cy.get('[data-cy="equipment-modal"]').should('be.visible');

      cy.get('ion-input[formControlName="name"]')
        .find('input')
        .clear()
        .type('Equipamento 1 - Updated');

      cy.get('[data-cy="equipment-modal"] ion-button[type="submit"]').click();

      cy.wait('@updateEquipment').its('response.statusCode').should('eq', 200);
    });

    it('should delete an equipment successfully', () => {
      cy.intercept('DELETE', '**/equipments/*', {
        statusCode: 204,
      }).as('deleteEquipment');

      cy.get('[data-cy="equipments-list"] ion-item').first().click();

      cy.get('[data-cy="equipment-modal"]').should('be.visible');

      cy.get('ion-fab-button[color="danger"]').click();

      cy.get('.alert-modal').should('exist');

      cy.get('#confirm-button').click();

      cy.wait('@deleteEquipment').its('response.statusCode').should('eq', 204);
    });
  });

  describe('Settings Tests', () => {
      beforeEach(() => {
        cy.login();
        cy.visit('/configuracoes');

        cy.intercept('GET', '**/settings/business-info*').as('getBusinessInfo');

        cy.intercept('PUT', '**/settings/business-info*', {
          statusCode: 200,
          body: {
            id: 1,
            name: 'SOS',
            cnpj: '12345678901234',
            cep: '12345678',
            address: 'Rua teste',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            phone: '123456789',
            image: 'https://picsum.photos/200/300',
            website: 'https://sos.org.br',
          },
        }).as('updateBusinessInfo');

        cy.intercept('PUT', '**/users/**', {
          statusCode: 200,
          body: {
            id: 1,
            name: 'SOS',
            email: 'teste@teste.com',
            cpf: '12345678901',
            fantasy_name: 'SOS',
            corporate_name: 'SOS',
            cnpj: '12345678901234',
            cep: '12345678',
            address: 'Rua teste',
            phone: '123456789',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            password: '12345678',
            confirmPassword: '12345678',
          },
        }).as('updateUserInfo');
      });

      it('should navigate to settings page successfully', () => {
        cy.url().should('include', '/configuracoes');
        cy.get('[data-cy="settings-page"]').should('be.visible');
      });
      it('should display business info modal and update the data', () => {
        cy.get('#business-info-button').should('be.visible').click();
        cy.get('[data-cy="business-info-modal"]').should('be.visible');

        cy.get('ion-input[formControlName="name"]')
          .find('input')
          .clear()
          .type('SOS');

        cy.get('ion-input[formControlName="cnpj"]')
          .find('input')
          .clear()
          .type('12345678901234');

        cy.get('ion-input[formControlName="email"]')
          .find('input')
          .clear()
          .type('teste@teste.com');

        cy.get('ion-input[formControlName="website"]')
          .find('input')
          .clear()
          .type('https://sos.org.br');

        cy.get('ion-input[formControlName="phone"]')
          .find('input')
          .clear()
          .type('123456789');

        cy.get('ion-input[formControlName="address"]')
          .find('input')
          .clear()
          .type('Rua teste');

        cy.get('ion-input[formControlName="address_number"]')
          .find('input')
          .clear()
          .type('123');

        cy.get('ion-input[formControlName="cep"]')
          .find('input')
          .clear()
          .type('12345678');

        cy.get('ion-input[formControlName="city"]')
          .find('input')
          .clear()
          .type('São Paulo');

        cy.get('ion-input[formControlName="state"]')
          .find('input')
          .clear()
          .type('SP');

        cy.get('ion-input[formControlName="country"]')
          .find('input')
          .clear()
          .type('Brasil');

        cy.get(
          '[data-cy="business-info-modal"] ion-button[type="submit"]',
        ).click();

        cy.wait('@updateBusinessInfo')
          .its('response.statusCode')
          .should('eq', 200);

        cy.get('ion-toast[color="success"]').should('exist');

        cy.get('[data-cy="close-modal"]').click();
        cy.get('[data-cy="business-info-modal"]').should('not.exist');
      });
      it('should display user info modal and update the data', () => {
        cy.get('#user-info-button').should('be.visible').click();
        cy.get('[data-cy="user-info-modal"]').should('be.visible');

        cy.get('ion-input[formControlName="name"]')
          .find('input')
          .clear()
          .type('SOS');

        cy.get('ion-input[formControlName="email"]')
          .find('input')
          .clear()
          .type('teste@teste.com');

        cy.get('ion-input[formControlName="cpf"]')
          .find('input')
          .clear()
          .type('12345678901');

        cy.get('ion-input[formControlName="fantasy_name"]')
          .find('input')
          .clear()
          .type('SOS');

        cy.get('ion-input[formControlName="corporate_name"]')
          .find('input')
          .clear()
          .type('SOS');

        cy.get('ion-input[formControlName="cnpj"]')
          .find('input')
          .clear()
          .type('12345678901234');

        cy.get('ion-input[formControlName="cep"]')
          .find('input')
          .clear()
          .type('12345678');

        cy.get('ion-input[formControlName="address"]')
          .find('input')
          .clear()
          .type('Rua teste');

        cy.get('ion-input[formControlName="phone"]')
          .find('input')
          .clear()
          .type('123456789');

        cy.get('ion-input[formControlName="city"]')
          .find('input')
          .clear()
          .type('São Paulo');

        cy.get('ion-input[formControlName="state"]')
          .find('input')
          .clear()
          .type('SP');

        cy.get('ion-input[formControlName="country"]')
          .find('input')
          .clear()
          .type('Brasil');

        cy.get('[data-cy="user-info-modal"] ion-button[type="submit"]').click();

        cy.wait('@updateUserInfo').its('response.statusCode').should('eq', 200);

        cy.get('ion-toast[color="success"]').should('exist');

        cy.get('[data-cy="close-modal"]').click();
        cy.get('[data-cy="user-info-modal"]').should('not.exist');
      });
    });

    describe('Users Tests', () => {
        beforeEach(() => {
          cy.intercept('POST', '**/users', {
            statusCode: 200,
            body: {
              current_page: 1,
              data: [
                {
                  id: 1,
                  name: 'Cliente 1',
                  type_id: 1,
                  type: {
                    id: 1,
                    name: 'Cliente',
                  },
                  phone: '11999999999',
                },
              ],
              per_page: 20,
              total: 1,
              last_page: 1,
            },
          }).as('getUsers');

          cy.login();
          cy.visit('/usuarios');

          cy.wait('@getUsers');
        });

        it('should navigate to users page successfully', () => {
          cy.url().should('include', '/usuarios');
          cy.get('[data-cy="users-page"]').should('be.visible');
        });

        it('should display users list with at least one item', () => {
          cy.get('[data-cy="users-list"]').should('exist');

          cy.get('[data-cy="users-list"] ion-item').should(
            'have.length.at.least',
            1,
          );
        });

        it('should display add button for new users', () => {
          cy.get('ion-fab').should('be.visible');
        });
      });
});
