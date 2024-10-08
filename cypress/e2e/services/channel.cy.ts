describe('Channel Functionality Tests', () => {

    beforeEach(() => {
      // Adjust the group ID and channel ID as needed
      cy.visit('/group/64e09ba4f40c4b8f9d5f9f9e/channel/78909ba4f40c4b8f9d5f9f9e'); 
    });
  
    // Test creating a new channel
    it('should create a new channel', () => {
      // Enter new channel details
      cy.get('input[ngModel="channelName"]').type('New Channel');
      cy.get('input[ngModel="channelDescription"]').type('This is a new channel');
  
      // Click the create button
      cy.get('button').contains('Create').click();
  
      // Assert the new channel is created and listed
      cy.get('p').contains('New Channel').should('be.visible');
      cy.get('p').contains('This is a new channel').should('be.visible');
    });
  
    // Test deleting a channel
    it('should delete a channel', () => {
      // Locate the channel and delete it
      cy.get('p').contains('QA Testing').parent().within(() => { // Changed 'Existing Channel' to 'QA Testing'
        cy.get('button').contains('Remove').click();  // Assuming the button text is "Remove"
      });
  
      // Confirm the deletion
      cy.on('window:confirm', (str) => {
        expect(str).to.equal('Are you sure you want to delete this channel?');
        return true;  // Simulate clicking "OK"
      });
  
      // Assert the channel is no longer listed
      cy.get('p').contains('QA Testing').should('not.exist');
    });
  
    // Test adding a member to the channel
    it('should add a member to the channel', () => {
      // Select a non-member and add to the channel
      cy.get('h4').contains('Non-Members').parent().within(() => {
        cy.get('li').contains('Add').click();  // Click the "Add" button for the first non-member
      });
  
      // Assert the member is added to the channel
      cy.get('h4').contains('Members').parent().within(() => {
        cy.get('li').should('contain.text', 'jane_smith'); // Replaced 'UserNameOfAddedMember' with 'jane_smith'
      });
    });
  
    // Test removing a member from the channel
    it('should remove a member from the channel', () => {
      // Remove a member from the channel
      cy.get('h4').contains('Members').parent().within(() => {
        cy.get('li').contains('Remove').click();  // Click the "Remove" button for the first member
      });
  
      // Assert the member is removed from the channel
      cy.get('h4').contains('Members').parent().within(() => {
        cy.get('li').should('not.contain.text', 'john_doe'); // Replaced 'UserNameOfRemovedMember' with 'john_doe'
      });
    });
  
});
