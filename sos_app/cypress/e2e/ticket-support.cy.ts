describe('Ticket Support App - E2E Tests', () => {
  describe('Authentication', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should redirect to login when accessing protected routes without authentication', () => {
      cy.visit('/tickets');
      cy.url().should('include', '/login');

      cy.visit('/profile');
      cy.url().should('include', '/login');

      cy.visit('/equipamentos');
      cy.url().should('include', '/login');
    });

    it('should display login form with email and password fields', () => {
      cy.get('ion-input[formControlName="email"]').should('exist');
      cy.get('ion-input[formControlName="password"]').should('exist');
      cy.get('ion-button[type="submit"]').should('exist');
    });

    it('should disable login button when form is invalid', () => {
      cy.get('ion-button[type="submit"]').should('be.disabled');
    });

    it('should enable login button when valid credentials are provided', () => {
      cy.get('ion-input[formControlName="email"]').find('input').type('test@test.com');
      cy.get('ion-input[formControlName="password"]').find('input').type('12345678');
      cy.get('ion-button[type="submit"]').should('not.be.disabled');
    });

    it('should successfully login and redirect to home', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: {
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@test.com',
            cpf: '12345678901',
            phone: '11999999999',
            address: 'Test Street',
            city: 'Test City',
            state: 'TS',
            country: 'Brazil',
            cep: '12345678',
          },
        },
      }).as('loginRequest');

      cy.intercept('GET', '**/user/verify', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          cpf: '12345678901',
          phone: '11999999999',
          address: 'Test Street',
          city: 'Test City',
          state: 'TS',
          country: 'Brazil',
          cep: '12345678',
        },
      }).as('verifyUser');

      cy.get('ion-input[formControlName="email"]').find('input').type('test@test.com');
      cy.get('ion-input[formControlName="password"]').find('input').type('12345678');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
      cy.wait('@verifyUser');
      cy.url().should('include', '/home');
    });

    it('should display error for invalid credentials', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { message: 'Unauthorized' },
      }).as('loginError');

      cy.get('ion-input[formControlName="email"]').find('input').type('wrong@test.com');
      cy.get('ion-input[formControlName="password"]').find('input').type('wrongpass');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@loginError').its('response.statusCode').should('eq', 401);
      cy.get('ion-toast[color="danger"]').should('exist');
    });
  });

  describe('Tickets Flow', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/tickets');
    });

    it('should navigate to tickets page successfully', () => {
      cy.url().should('include', '/tickets');
    });

    it('should display tickets list section', () => {
      cy.intercept('GET', '**/tickets/user*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              title: 'Test Ticket 1',
              description: 'Description 1',
              status_id: 1,
              status: { id: 1, name: 'Aberto' },
              equipment_id: 1,
              created_at: '2024-01-15T10:30:00Z',
              updated_at: '2024-01-15T10:30:00Z',
            },
            {
              id: 2,
              title: 'Test Ticket 2',
              description: 'Description 2',
              status_id: 2,
              status: { id: 2, name: 'Em andamento' },
              equipment_id: 1,
              created_at: '2024-01-14T15:00:00Z',
              updated_at: '2024-01-14T15:00:00Z',
            },
          ],
          per_page: 20,
          total: 2,
          last_page: 1,
        },
      }).as('getTickets');

      cy.wait('@getTickets');
      cy.get('[data-cy="tickets-list"]').should('exist');
    });

    it('should display empty state when no tickets exist', () => {
      cy.intercept('GET', '**/tickets/user*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [],
          per_page: 20,
          total: 0,
          last_page: 1,
        },
      }).as('getEmptyTickets');

      cy.wait('@getEmptyTickets');
      cy.get('[data-cy="empty-tickets-message"]').should('be.visible');
      cy.contains('Nenhum chamado cadastrado').should('exist');
    });

    it('should open modal to create a new ticket when FAB is clicked', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Equipment 1',
              description: 'Description 1',
              category_id: 1,
              category: { id: 1, name: 'Category 1' },
              user_id: 1,
              obs: 'Obs 1',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getEquipments');

      cy.get('ion-fab-button').click();
      cy.wait('@getEquipments');
      cy.get('[data-cy="ticket-modal"]').should('be.visible');
    });

    it('should create a new ticket successfully', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Equipment 1',
              description: 'Description 1',
              category_id: 1,
              category: { id: 1, name: 'Category 1' },
              user_id: 1,
              obs: 'Obs 1',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getEquipments');

      cy.intercept('POST', '**/tickets', {
        statusCode: 201,
        body: {
          id: 3,
          title: 'New Test Ticket',
          description: 'New Description',
          status_id: 1,
          status: { id: 1, name: 'Aberto' },
          equipment_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }).as('createTicket');

      cy.get('ion-fab-button').click();
      cy.wait('@getEquipments');

      cy.get('[data-cy="ticket-modal"]').should('be.visible');
      cy.get('ion-input[formControlName="title"]').find('input').type('New Test Ticket');
      cy.get('ion-select[formControlName="equipment_id"]').click();
      cy.get('ion-select-option').first().click();
      cy.get('ion-textarea[formControlName="description"]').find('textarea').type('New Description');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@createTicket').its('response.statusCode').should('eq', 201);
      cy.get('[data-cy="ticket-modal"]').should('not.exist');
    });

    it('should show validation errors when creating ticket with empty fields', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Equipment 1',
              description: 'Description 1',
              category_id: 1,
              category: { id: 1, name: 'Category 1' },
              user_id: 1,
              obs: 'Obs 1',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getEquipments');

      cy.get('ion-fab-button').click();
      cy.wait('@getEquipments');

      cy.get('[data-cy="ticket-modal"]').should('be.visible');
      cy.get('ion-button[type="submit"]').click();

      cy.get('ion-input[formControlName="title"]').should('have.attr', 'aria-invalid', 'true');
      cy.get('ion-select[formControlName="equipment_id"]').should('have.attr', 'aria-invalid', 'true');
      cy.get('ion-textarea[formControlName="description"]').should('have.attr', 'aria-invalid', 'true');
    });

    it('should open existing ticket in view mode', () => {
      cy.intercept('GET', '**/tickets/user*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              title: 'Existing Ticket',
              description: 'Existing Description',
              status_id: 1,
              status: { id: 1, name: 'Aberto' },
              equipment_id: 1,
              created_at: '2024-01-15T10:30:00Z',
              updated_at: '2024-01-15T10:30:00Z',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getTickets');

      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Equipment 1',
              description: 'Description 1',
              category_id: 1,
              category: { id: 1, name: 'Category 1' },
              user_id: 1,
              obs: 'Obs 1',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getEquipments');

      cy.intercept('GET', '**/tickets/1', {
        statusCode: 200,
        body: {
          id: 1,
          title: 'Existing Ticket',
          description: 'Existing Description',
          status_id: 1,
          status: { id: 1, name: 'Aberto' },
          equipment_id: 1,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
        },
      }).as('getTicketDetail');

      cy.wait('@getTickets');
      cy.get('[data-cy="tickets-list"] ion-item').first().click();
      cy.wait('@getEquipments');
      cy.wait('@getTicketDetail');
      cy.get('[data-cy="ticket-modal"]').should('be.visible');
      cy.get('ion-input[formControlName="title"]').should('have.value', 'Existing Ticket');
    });
  });

  describe('Profile Flow', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/profile');
    });

    it('should navigate to profile page successfully', () => {
      cy.url().should('include', '/profile');
    });

    it('should display user profile form with current data', () => {
      cy.intercept('GET', '**/user/verify', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          cpf: '12345678901',
          phone: '11999999999',
          address: 'Test Street',
          city: 'Test City',
          state: 'TS',
          country: 'Brazil',
          cep: '12345678',
          corporate_name: 'Test Corp',
          fantasy_name: 'Test Fantasy',
        },
      }).as('verifyUser');

      cy.wait('@verifyUser');
      cy.get('[data-cy="profile-form"]').should('exist');
      cy.get('ion-input[formControlName="name"]').should('have.value', 'Test User');
      cy.get('ion-input[formControlName="email"]').should('have.value', 'test@test.com');
    });

    it('should update profile information successfully', () => {
      cy.intercept('GET', '**/user/verify', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          cpf: '12345678901',
          phone: '11999999999',
          address: 'Test Street',
          city: 'Test City',
          state: 'TS',
          country: 'Brazil',
          cep: '12345678',
        },
      }).as('verifyUser');

      cy.intercept('PUT', '**/users/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Updated Name',
          email: 'test@test.com',
          cpf: '12345678901',
          phone: '11888888888',
          address: 'Updated Street',
          city: 'Updated City',
          state: 'UC',
          country: 'Brazil',
          cep: '87654321',
        },
      }).as('updateUser');

      cy.wait('@verifyUser');
      cy.get('ion-input[formControlName="name"]').find('input').clear().type('Updated Name');
      cy.get('ion-input[formControlName="phone"]').find('input').clear().type('11888888888');
      cy.get('ion-input[formControlName="address"]').find('input').clear().type('Updated Street');
      cy.get('ion-input[formControlName="city"]').find('input').clear().type('Updated City');
      cy.get('ion-input[formControlName="state"]').find('input').clear().type('UC');
      cy.get('ion-input[formControlName="cep"]').find('input').clear().type('87654321');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@updateUser').its('response.statusCode').should('eq', 200);
      cy.get('ion-toast[color="success"]').should('exist');
    });

    it('should open password change modal', () => {
      cy.get('#open-modal').click();
      cy.get('ion-modal').should('be.visible');
      cy.get('ion-input[formControlName="password"]').should('exist');
      cy.get('ion-input[formControlName="password_confirmation"]').should('exist');
    });

    it('should change password successfully', () => {
      cy.intercept('PUT', '**/user/password', {
        statusCode: 200,
        body: { message: 'Password updated successfully' },
      }).as('updatePassword');

      cy.get('#open-modal').click();
      cy.get('ion-modal').should('be.visible');
      cy.get('ion-input[formControlName="password"]').find('input').type('NewPassword123');
      cy.get('ion-input[formControlName="password_confirmation"]').find('input').type('NewPassword123');
      cy.get('ion-modal ion-button[type="submit"]').click();

      cy.wait('@updatePassword').its('response.statusCode').should('eq', 200);
      cy.get('ion-toast[color="success"]').should('exist');
      cy.get('ion-modal').should('not.exist');
    });

    it('should show validation error when passwords do not match', () => {
      cy.get('#open-modal').click();
      cy.get('ion-modal').should('be.visible');
      cy.get('ion-input[formControlName="password"]').find('input').type('NewPassword123');
      cy.get('ion-input[formControlName="password_confirmation"]').find('input').type('DifferentPassword');
      cy.get('ion-modal ion-button[type="submit"]').click();

      cy.get('ion-input[formControlName="password_confirmation"]').should('have.attr', 'aria-invalid', 'true');
    });

    it('should update avatar image', () => {
      cy.intercept('POST', '**/user/image/change', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          image: 'https://example.com/new-avatar.jpg',
        },
      }).as('updateAvatar');

      cy.get('ion-card[button="true"]').click();
      cy.wait('@updateAvatar').its('response.statusCode').should('eq', 200);
      cy.get('ion-toast[color="success"]').should('exist');
    });
  });

  describe('Equipments Flow', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/equipamentos');
    });

    it('should navigate to equipments page successfully', () => {
      cy.url().should('include', '/equipamentos');
    });

    it('should display equipments list with filter', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Equipment 1',
              description: 'Description 1',
              category_id: 1,
              category: { id: 1, name: 'Category 1' },
              user_id: 1,
              obs: 'Obs 1',
            },
            {
              id: 2,
              name: 'Equipment 2',
              description: 'Description 2',
              category_id: 2,
              category: { id: 2, name: 'Category 2' },
              user_id: 1,
              obs: 'Obs 2',
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
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
        ],
      }).as('getCategories');

      cy.wait('@getEquipments');
      cy.wait('@getCategories');
      cy.get('[data-cy="equipments-list"]').should('exist');
      cy.get('[data-cy="equipments-list"] ion-item').should('have.length.at.least', 1);
    });

    it('should display empty state when no equipments exist', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [],
          per_page: 20,
          total: 0,
          last_page: 1,
        },
      }).as('getEmptyEquipments');

      cy.wait('@getEmptyEquipments');
      cy.get('[data-cy="empty-equipments-message"]').should('be.visible');
      cy.contains('Nenhum equipamento cadastrado').should('exist');
    });

    it('should filter equipments by description', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Filtered Equipment',
              description: 'Filtered Description',
              category_id: 1,
              category: { id: 1, name: 'Category 1' },
              user_id: 1,
              obs: 'Obs 1',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getFilteredEquipments');

      cy.get('ion-input[formControlName="description"]').find('input').type('Filtered');
      cy.wait('@getFilteredEquipments');
      cy.get('[data-cy="equipments-list"] ion-item').should('have.length', 1);
    });

    it('should open modal to create a new equipment', () => {
      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
        ],
      }).as('getCategories');

      cy.get('ion-fab-button').click();
      cy.wait('@getCategories');
      cy.get('[data-cy="equipment-modal"]').should('be.visible');
    });

    it('should create a new equipment successfully', () => {
      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
        ],
      }).as('getCategories');

      cy.intercept('POST', '**/equipments', {
        statusCode: 201,
        body: {
          id: 3,
          name: 'New Equipment',
          description: 'New Description',
          category_id: 1,
          category: { id: 1, name: 'Category 1' },
          user_id: 1,
          obs: 'New Obs',
        },
      }).as('createEquipment');

      cy.get('ion-fab-button').click();
      cy.wait('@getCategories');
      cy.get('[data-cy="equipment-modal"]').should('be.visible');
      cy.get('ion-input[formControlName="name"]').find('input').type('New Equipment');
      cy.get('ion-textarea[formControlName="description"]').find('textarea').type('New Description');
      cy.get('ion-select[formControlName="category_id"]').click();
      cy.get('ion-select-option').first().click();
      cy.get('ion-input[formControlName="obs"]').find('input').type('New Obs');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@createEquipment').its('response.statusCode').should('eq', 201);
      cy.get('[data-cy="equipment-modal"]').should('not.exist');
      cy.get('ion-toast[color="success"]').should('exist');
    });

    it('should edit an existing equipment', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [
            {
              id: 1,
              name: 'Equipment 1',
              description: 'Description 1',
              category_id: 1,
              category: { id: 1, name: 'Category 1' },
              user_id: 1,
              obs: 'Obs 1',
            },
          ],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getEquipments');

      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Category 1' },
          { id: 2, name: 'Category 2' },
        ],
      }).as('getCategories');

      cy.intercept('PUT', '**/equipments/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Updated Equipment',
          description: 'Updated Description',
          category_id: 2,
          category: { id: 2, name: 'Category 2' },
          user_id: 1,
          obs: 'Updated Obs',
        },
      }).as('updateEquipment');

      cy.wait('@getEquipments');
      cy.get('[data-cy="equipments-list"] ion-item').first().click();
      cy.wait('@getCategories');
      cy.get('[data-cy="equipment-modal"]').should('be.visible');
      cy.get('ion-input[formControlName="name"]').find('input').clear().type('Updated Equipment');
      cy.get('ion-textarea[formControlName="description"]').find('textarea').clear().type('Updated Description');
      cy.get('ion-select[formControlName="category_id"]').click();
      cy.get('ion-select-option').last().click();
      cy.get('ion-input[formControlName="obs"]').find('input').clear().type('Updated Obs');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@updateEquipment').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy="equipment-modal"]').should('not.exist');
      cy.get('ion-toast[color="success"]').should('exist');
    });

    it('should show validation errors when creating equipment with empty required fields', () => {
      cy.intercept('GET', '**/categories', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Category 1' },
        ],
      }).as('getCategories');

      cy.get('ion-fab-button').click();
      cy.wait('@getCategories');
      cy.get('[data-cy="equipment-modal"]').should('be.visible');
      cy.get('ion-button[type="submit"]').click();

      cy.get('ion-input[formControlName="name"]').should('have.attr', 'aria-invalid', 'true');
      cy.get('ion-select[formControlName="category_id"]').should('have.attr', 'aria-invalid', 'true');
    });
  });

  describe('Navigation and Layout', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should navigate between tabs using bottom tab bar', () => {
      cy.visit('/home');
      cy.url().should('include', '/home');

      cy.get('ion-tab-button[tab="tickets"]').click();
      cy.url().should('include', '/tickets');

      cy.get('ion-tab-button[tab="profile"]').click();
      cy.url().should('include', '/profile');

      cy.get('ion-tab-button[tab="equipamentos"]').click();
      cy.url().should('include', '/equipamentos');
    });

    it('should display user info in header', () => {
      cy.visit('/home');
      cy.get('ion-title').should('contain', 'Início');
    });

    it('should handle logout', () => {
      cy.visit('/home');
      cy.intercept('POST', '**/logout', {
        statusCode: 200,
        body: { message: 'Logged out' },
      }).as('logout');

      cy.get('ion-menu-button').click();
      cy.get('ion-menu').should('be.visible');
      cy.contains('Sair').click();

      cy.wait('@logout').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/login');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should display error toast on API failure when creating ticket', () => {
      cy.intercept('POST', '**/customer/equipments/filter*', {
        statusCode: 200,
        body: {
          current_page: 1,
          data: [{ id: 1, name: 'Equipment 1', category_id: 1, category: { id: 1, name: 'Category 1' } }],
          per_page: 20,
          total: 1,
          last_page: 1,
        },
      }).as('getEquipments');

      cy.intercept('POST', '**/tickets', {
        statusCode: 500,
        body: { message: 'Internal Server Error' },
      }).as('createTicketError');

      cy.visit('/tickets');
      cy.get('ion-fab-button').click();
      cy.wait('@getEquipments');
      cy.get('ion-input[formControlName="title"]').find('input').type('Test Ticket');
      cy.get('ion-select[formControlName="equipment_id"]').click();
      cy.get('ion-select-option').first().click();
      cy.get('ion-textarea[formControlName="description"]').find('textarea').type('Test Description');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@createTicketError').its('response.statusCode').should('eq', 500);
      cy.get('ion-toast[color="danger"]').should('exist');
    });

    it('should display error toast on API failure when updating profile', () => {
      cy.intercept('GET', '**/user/verify', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
        },
      }).as('verifyUser');

      cy.intercept('PUT', '**/users/1', {
        statusCode: 500,
        body: { message: 'Internal Server Error' },
      }).as('updateUserError');

      cy.visit('/profile');
      cy.wait('@verifyUser');
      cy.get('ion-input[formControlName="name"]').find('input').clear().type('Updated Name');
      cy.get('ion-button[type="submit"]').click();

      cy.wait('@updateUserError').its('response.statusCode').should('eq', 500);
      cy.get('ion-toast[color="danger"]').should('exist');
    });
  });
});