describe('Group Page', () => {

    beforeEach(() => {
      // Log in before visiting the group page
      cy.visit('/login'); // Visit the login page

      // Perform the login
      cy.get('input#username').type('john_doe'); // Use a valid username
      cy.get('input#password').type('pw'); // Use a valid password
      cy.get('button[type="submit"]').click(); // Click the login button

      // Ensure we are logged in by checking the redirect
      cy.url().should('include', '/profile');

      // Assume the user is logged in and visits the group page with a specific group ID
      cy.visit('/group/64e09ba4f40c4b8f9d5f9f9e');  // Changed the group ID to "Developers"
    });
  
    // Test the group details are displayed correctly
    it('should display the group details correctly', () => {
      cy.get('h1.display-4').should('contain.text', 'Welcome to'); // Check for welcome message
      cy.get('strong').contains('Group Name:').next().should('not.be.empty'); // Check group name is displayed
      cy.get('strong').contains('Group Description:').next().should('not.be.empty'); // Check group description is displayed
    });
  
    // Test editing group details
    it('should allow editing group details', () => {
      // Switch to edit mode
      cy.get('button').contains('Edit Details').click();
  
      // Change group name and description
      cy.get('input[ngModel="groupEditData.name"]').clear().type('UpdatedGroupName');
      cy.get('input[ngModel="groupEditData.description"]').clear().type('UpdatedGroupDescription');
  
      // Save the changes
      cy.get('button').contains('Save Details').click();
  
      // Check the success alert and updated details
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Group updated successfully!');
      });
  
      // Verify updated group name and description
      cy.get('strong').contains('Group Name:').next().should('contain.text', 'UpdatedGroupName');
      cy.get('strong').contains('Group Description:').next().should('contain.text', 'UpdatedGroupDescription');
    });
  
    // Test canceling edit mode without saving
    it('should not save changes if canceled in edit mode', () => {
      // Switch to edit mode
      cy.get('button').contains('Edit Details').click();
  
      // Modify the group name but cancel
      cy.get('input[ngModel="groupEditData.name"]').clear().type('CancelledGroupName');
      cy.get('button').contains('Cancel').click();
  
      // Ensure the changes were not saved
      cy.get('strong').contains('Group Name:').next().should('not.contain.text', 'CancelledGroupName');
    });
  
    // Test creating a new channel
    it('should create a new channel', () => {
      // Enter new channel details
      cy.get('input[ngModel="channelName"]').type('New Channel');
      cy.get('input[ngModel="channelDescription"]').type('This is a new channel');
  
      // Click the create button
      cy.get('button').contains('Create').click();
  
      // Verify that the new channel is listed
      cy.get('p').contains('New Channel').should('exist');
      cy.get('p').contains('This is a new channel').should('exist');
    });
  
    // Test editing a channel
    it('should allow editing a channel', () => {
      // Click the edit button for a specific channel
      cy.get('button').contains('Edit').first().click();
  
      // Change the channel name and description
      cy.get('input[ngModel="editChannelData.name"]').clear().type('Updated Channel Name');
      cy.get('input[ngModel="editChannelData.description"]').clear().type('Updated Channel Description');
  
      // Save the changes
      cy.get('button').contains('Save').click();
  
      // Verify that the channel details are updated
      cy.get('p').contains('Updated Channel Name').should('exist');
      cy.get('p').contains('Updated Channel Description').should('exist');
    });
  
    // Test deleting a channel
    it('should delete a channel', () => {
      // Click the delete button for a specific channel
      cy.get('button').contains('Remove').first().click();
  
      // Confirm the delete action in the alert
      cy.on('window:confirm', () => true);
  
      // Verify that the channel is no longer listed
      cy.get('p').contains('QA Testing').should('not.exist'); // Assuming "QA Testing" is the channel being deleted
    });
  
    // Test removing a user from the group
    it('should remove a user from the group', () => {
      // Click the remove button for a specific user
      cy.get('button').contains('Remove').first().click();
  
      // Confirm the remove action in the alert
      cy.on('window:confirm', () => true);
  
      // Verify that the user is no longer listed in active members
      cy.get('p').contains('john_doe').should('not.exist'); // Assuming "john_doe" is the user being removed
    });
  
    // Test allowing a user to join from interested members
    it('should allow a user to join from interested members', () => {
      // Click the allow button for an interested user
      cy.get('button').contains('Allow').first().click();
  
      // Verify that the user is moved from interested to active members
      cy.get('p').contains('jane_smith').should('exist'); // Assuming "jane_smith" is the user being allowed
    });
  
  });
