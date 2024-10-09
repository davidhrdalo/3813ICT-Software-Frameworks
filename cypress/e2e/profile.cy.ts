describe('Profile Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input#username').type('john_doe');
    cy.get('input#password').type('pw');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profile');

    // Wait for the profile page to load
    cy.get('h1.display-4', { timeout: 10000 }).should('be.visible');
  });

  it('should display the user profile details correctly', () => {
    cy.get('h1.display-4').should('contain.text', 'Welcome');
    cy.get('strong').contains('Name:').next().should('not.be.empty');
    cy.get('strong').contains('Username:').next().should('not.be.empty');
    cy.get('strong').contains('Email:').next().should('not.be.empty');
    cy.get('strong').contains('Date of Birth:').next().should('not.be.empty');
  });

  it('should enter and save user details in edit mode', () => {
    cy.get('button').contains('Edit Details').click();

    // Wait for the edit form to be visible
    cy.get('input[type="text"]', { timeout: 10000 }).should('be.visible');

    // Change first and last name
    cy.get('input[type="text"]').eq(0).clear().type('UpdatedFirstName');
    cy.get('input[type="text"]').eq(1).clear().type('UpdatedLastName');

    // Change current status
    cy.get('input[type="text"]').eq(2).clear().type('Available');

    // Click Save button
    cy.get('button').contains('Save Details').click();

    // Verify success message
    cy.get('.alert-success').should(
      'contain.text',
      'Profile updated successfully!'
    );

    // Check the updated first and last name
    cy.get('strong')
      .contains('Name:')
      .next()
      .should('contain.text', 'UpdatedFirstName UpdatedLastName');
    cy.get('strong')
      .contains('Current Status:')
      .next()
      .should('contain.text', 'Available');
  });

  it('should not save changes if canceled in edit mode', () => {
    // Get the initial name
    cy.get('strong')
      .contains('Name:')
      .next()
      .invoke('text')
      .then((initialName) => {
        cy.get('button').contains('Edit Details').click();

        // Wait for the edit form to be visible
        cy.get('input[type="text"]', { timeout: 10000 }).should('be.visible');

        // Modify first name but then cancel
        cy.get('input[type="text"]').eq(0).clear().type('CancelledFirstName');
        cy.get('button').contains('Cancel').click();

        // Ensure that the changes were not saved
        cy.get('strong')
          .contains('Name:')
          .next()
          .should('contain.text', initialName.trim());
      });
  });

  /*
  it('should only show Super Admin features to super admins', () => {
    // Check if the welcome message indicates Super Admin status
    cy.get('h1.display-4').then(($header) => {
      const welcomeText = $header.text();
      if (welcomeText.includes('Super Admin')) {
        cy.contains('User Management').should('exist');
        cy.contains('Group Management').should('exist');
      } else {
        // If not a Super Admin, these sections should not be visible
        cy.get('body').then(($body) => {
          if ($body.find('h3:contains("User Management")').length > 0) {
            cy.log('User Management section found when it should not be visible');
          }
          if ($body.find('h3:contains("Group Management")').length > 0) {
            cy.log('Group Management section found when it should not be visible');
          }
        });
        cy.contains('User Management').should('not.exist');
        cy.contains('Group Management').should('not.exist');
      }
    });
  });
  */
});
