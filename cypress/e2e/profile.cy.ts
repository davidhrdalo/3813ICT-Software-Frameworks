describe('Profile Page', () => {

    beforeEach(() => {
      // Log in before visiting the group page
      cy.visit('/login'); // Visit the login page

      // Perform the login
      cy.get('input#username').type('john_doe'); // Use a valid username
      cy.get('input#password').type('pw'); // Use a valid password
      cy.get('button[type="submit"]').click(); // Click the login button

      // Ensure we are logged in by checking the redirect
      cy.url().should('include', '/profile');

      // Assume the user is logged in and visiting the profile page
      cy.visit('/profile');  // Navigate to the profile page
    });
  
    // Test profile details are correctly displayed
    it('should display the user profile details correctly', () => {
      cy.get('h1.display-4').should('contain.text', 'Welcome'); // Check for welcome message
      cy.get('strong').contains('Name:').next().should('not.be.empty'); // Check name is displayed
      cy.get('strong').contains('Username:').next().should('not.be.empty'); // Check username is displayed
      cy.get('strong').contains('Email:').next().should('not.be.empty'); // Check email is displayed
      cy.get('strong').contains('Date of Birth:').next().should('not.be.empty'); // Check date of birth is displayed
    });
  
    // Test entering and saving details in edit mode
    it('should enter and save user details in edit mode', () => {
      // Switch to edit mode
      cy.get('button').contains('Edit Details').click();
  
      // Change first and last name
      cy.get('input[ngModel="userEditData.firstName"]').clear().type('UpdatedFirstName');
      cy.get('input[ngModel="userEditData.lastName"]').clear().type('UpdatedLastName');
  
      // Change current status
      cy.get('input[ngModel="userEditData.status"]').clear().type('Available');
  
      // Click Save button
      cy.get('button').contains('Save Details').click();
  
      // Verify success alert and updated details
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Profile updated successfully!');
      });
  
      // Check the updated first and last name
      cy.get('strong').contains('Name:').next().should('contain.text', 'UpdatedFirstName UpdatedLastName');
      cy.get('strong').contains('Current Status:').next().should('contain.text', 'Available');
    });
  
    // Test that changes are not saved if the user cancels in edit mode
    it('should not save changes if canceled in edit mode', () => {
      // Switch to edit mode
      cy.get('button').contains('Edit Details').click();
  
      // Modify first name but then cancel
      cy.get('input[ngModel="userEditData.firstName"]').clear().type('CancelledFirstName');
      cy.get('button').contains('Cancel').click();
  
      // Ensure that the changes were not saved
      cy.get('strong').contains('Name:').next().should('not.contain.text', 'CancelledFirstName');
    });
  
    // Test visibility of Super Admin features
    it('should only show Super Admin features to super admins', () => {
      // Check if Super Admin section is visible based on roles
      cy.window().its('userData').should('have.property', 'roles').then((roles) => {
        if (roles.includes('super')) {
          cy.contains('User Management').should('be.visible');
          cy.contains('Group Management').should('be.visible');
        } else {
          cy.contains('User Management').should('not.exist');
          cy.contains('Group Management').should('not.exist');
        }
      });
    });
  
});
