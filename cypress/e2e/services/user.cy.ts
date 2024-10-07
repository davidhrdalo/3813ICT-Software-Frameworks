describe('User Service Functionality Tests', () => {

  beforeEach(() => {
    // Set up your initial visit to the user management page (adjust the route as needed)
    cy.visit('/users');
  });

  // Test creating a new user
  it('should create a new user', () => {
    // Click on "Create User" button
    cy.get('button').contains('Create User').click();

    // Fill in the user creation form
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('password123');

    // Submit the form
    cy.get('button').contains('Submit').click();

    // Assert that the new user is created and listed
    cy.get('li').contains('newuser').should('be.visible');
  });

  // Test deleting a user
  it('should delete a user', () => {
    // Locate the user and delete it
    cy.get('li').contains('existinguser').parent().within(() => {
      cy.get('button').contains('Delete').click();
    });

    // Confirm the deletion
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure you want to delete this user?');
      return true;  // Simulate clicking "OK"
    });

    // Assert that the user is deleted and no longer listed
    cy.get('li').contains('existinguser').should('not.exist');
  });

  // Test promoting a user to Group Admin
  it('should promote a user to Group Admin', () => {
    // Locate the user and promote to Group Admin
    cy.get('li').contains('regularuser').parent().within(() => {
      cy.get('button').contains('Promote to Group Admin').click();
    });

    // Assert the user's role is updated
    cy.get('li').contains('regularuser').parent().within(() => {
      cy.get('span').contains('Group Admin').should('be.visible');
    });
  });

  // Test promoting a user to Super Admin
  it('should promote a user to Super Admin', () => {
    // Locate the user and promote to Super Admin
    cy.get('li').contains('groupadminuser').parent().within(() => {
      cy.get('button').contains('Promote to Super Admin').click();
    });

    // Assert the user's role is updated
    cy.get('li').contains('groupadminuser').parent().within(() => {
      cy.get('span').contains('Super Admin').should('be.visible');
    });
  });

});
