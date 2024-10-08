describe('Group Functionality Tests', () => {
  
  beforeEach(() => {
    cy.visit('/groups');  // Adjust the URL to the page where groups are managed
  });

  // Test creating a new group
  it('should create a new group', () => {
    // Click on "Create Group" button or link
    cy.get('button').contains('Create Group').click();

    // Fill in the group creation form
    cy.get('input[ngModel="groupName"]').type('New Test Group');
    cy.get('input[ngModel="groupDescription"]').type('This is a test group description');

    // Submit the form
    cy.get('button').contains('Submit').click();

    // Assert that the new group is created and listed
    cy.get('h3').contains('New Test Group').should('be.visible');
    cy.get('p').contains('This is a test group description').should('be.visible');
  });

  // Test deleting a group
  it('should delete a group', () => {
    // Locate the group and click "Delete"
    cy.get('h3').contains('Developers').parent().within(() => { // Changed 'Existing Group' to 'Developers'
      cy.get('button').contains('Delete').click();
    });

    // Confirm the deletion
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure you want to delete this group?');
      return true;
    });

    // Assert the group is no longer listed
    cy.get('h3').contains('Developers').should('not.exist');
  });

  // Test adding a user to a group's interested list
  it('should allow a user to express interest in a group', () => {
    // Locate the group and click "Interested"
    cy.get('h3').contains('Designers').parent().within(() => { // Changed 'Some Group' to 'Designers'
      cy.get('button').contains('Interested').click();
    });

    // Assert that interest is registered
    cy.on('window:alert', (str) => {
      expect(str).to.equal('You have registered your interest in this group.');
    });

    // Optionally check that the UI reflects the change
    cy.get('button').contains('Unregister Interest').should('be.visible');
  });

  // Test removing a user from a group's interested list
  it('should remove a user from the interested list of a group', () => {
    // Locate the group and click "Unregister Interest"
    cy.get('h3').contains('Designers').parent().within(() => { // Changed 'Some Group' to 'Designers'
      cy.get('button').contains('Unregister Interest').click();
    });

    // Assert that interest is unregistered
    cy.on('window:alert', (str) => {
      expect(str).to.equal('You have unregistered your interest in this group.');
    });

    // Optionally check that the UI reflects the change
    cy.get('button').contains('Interested').should('be.visible');
  });

  // Test adding a member to a group
  it('should add a member to the group', () => {
    // Locate the group, click "Add Member" and select a user
    cy.get('h3').contains('Developers').parent().within(() => { // Changed 'Some Group' to 'Developers'
      cy.get('button').contains('Add Member').click();
    });

    // Select the user from a list or enter their details
    cy.get('select').select('jane_smith'); // Changed 'UserToAdd' to 'jane_smith'

    // Submit the form to add the member
    cy.get('button').contains('Submit').click();

    // Assert the member is added
    cy.get('h4').contains('Members').parent().within(() => {
      cy.get('li').contains('jane_smith').should('be.visible'); // Changed 'UserToAdd' to 'jane_smith'
    });
  });

  // Test removing a member from a group
  it('should remove a member from the group', () => {
    // Locate the group, and in the members list, click "Remove" for a user
    cy.get('h3').contains('Developers').parent().within(() => { // Changed 'Some Group' to 'Developers'
      cy.get('h4').contains('Members').parent().within(() => {
        cy.get('li').contains('john_doe').parent().within(() => { // Changed 'UserToRemove' to 'john_doe'
          cy.get('button').contains('Remove').click();
        });
      });
    });

    // Assert the member is removed
    cy.get('h4').contains('Members').parent().within(() => {
      cy.get('li').contains('john_doe').should('not.exist'); // Changed 'UserToRemove' to 'john_doe'
    });
  });

  // Test updating a group
  it('should update the group details', () => {
    // Locate the group and click "Edit"
    cy.get('h3').contains('Developers').parent().within(() => { // Changed 'Some Group' to 'Developers'
      cy.get('button').contains('Edit').click();
    });

    // Update the group details
    cy.get('input[ngModel="groupName"]').clear().type('Updated Group Name');
    cy.get('input[ngModel="groupDescription"]').clear().type('Updated group description');

    // Submit the form
    cy.get('button').contains('Save').click();

    // Assert the group details are updated
    cy.get('h3').contains('Updated Group Name').should('be.visible');
    cy.get('p').contains('Updated group description').should('be.visible');
  });

});
