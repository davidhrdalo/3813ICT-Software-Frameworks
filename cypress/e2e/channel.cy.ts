describe('Channel Page', () => {

    beforeEach(() => {
      // Log in before visiting the group page
      cy.visit('/login'); // Visit the login page

      // Perform the login
      cy.get('input#username').type('john_doe'); // Use a valid username
      cy.get('input#password').type('pw'); // Use a valid password
      cy.get('button[type="submit"]').click(); // Click the login button

      // Ensure we are logged in by checking the redirect
      cy.url().should('include', '/profile');

      // Assume the user is logged in and visiting a specific channel page with group and channel IDs
      cy.visit('/group/64e09ba4f40c4b8f9d5f9f9e/channel/78909ba4f40c4b8f9d5f9f9e');  // Adjusted group and channel IDs
    });
  
    // Test the channel details are displayed correctly
    it('should display the channel details correctly', () => {
      cy.get('h1.display-5').should('contain.text', 'Welcome to'); // Check the welcome message for the channel
      cy.get('p.lead').should('not.be.empty'); // Check the channel description is displayed
    });
  
    // Test the list of channel members is displayed
    it('should display a list of channel members', () => {
      cy.get('h4').contains('Members').should('be.visible'); // Ensure the Members section is visible
      cy.get('.list-group-item').should('have.length.at.least', 1); // Ensure at least one member is listed
    });
  
    // Test adding a member to the channel
    it('should allow adding a member to the channel', () => {
      cy.get('h4').contains('Non-Members').should('be.visible'); // Ensure the Non-Members section is visible
      cy.get('.list-group-item').contains('Add').click(); // Click the "Add" button for a non-member
      cy.on('window:alert', (str) => {
        expect(str).to.equal('User added to channel successfully!');
      });
    });
  
    // Test removing a member from the channel
    it('should allow removing a member from the channel', () => {
      cy.get('.list-group-item').contains('Remove').click(); // Click the "Remove" button for a channel member
      cy.on('window:alert', (str) => {
        expect(str).to.equal('User removed from channel successfully!');
      });
    });
  
    // Test sending a text message in chat
    it('should allow sending a text message', () => {
      // Type a message into the input field
      cy.get('input#messagecontent').type('Hello, everyone!');
      // Click the Send button
      cy.get('button').contains('Send Message').click();
      // Verify the message appears in the chat
      cy.get('.chat-bubble').contains('Hello, everyone!').should('be.visible');
    });
  
    // Test displaying system messages when a user joins the channel
    it('should display a system message when a user joins the channel', () => {
      // Simulate a user joining the channel via socket
      cy.window().then((win) => {
        win.socketService.joinChannel('78909ba4f40c4b8f9d5f9f9e'); // Simulate joining the channel
      });
      cy.get('.system-message').contains('has joined the channel').should('be.visible');
    });
  
    // Test displaying system messages when a user leaves the channel
    it('should display a system message when a user leaves the channel', () => {
      // Simulate a user leaving the channel via socket
      cy.window().then((win) => {
        win.socketService.leaveChannel('78909ba4f40c4b8f9d5f9f9e'); // Simulate leaving the channel
      });
      cy.get('.system-message').contains('has left the channel').should('be.visible');
    });
  
    // Test the video component is displayed
    it('should display the video component', () => {
      cy.get('app-video').should('be.visible'); // Ensure the video component is displayed
    });
  
  });
