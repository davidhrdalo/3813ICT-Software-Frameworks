describe('Group Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input#username').type('john_doe');
    cy.get('input#password').type('pw');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profile');
    cy.visit('/group/64e09ba4f40c4b8f9d5f9f9e');
    
    // Wait for the group page to load
    cy.get('h1.display-4', { timeout: 10000 }).should('be.visible');
  });

  it('should display the group details correctly', () => {
    cy.get('h1.display-4').should('contain.text', 'Welcome to');
    cy.get('strong').contains('Group Name:').next().should('not.be.empty');
    cy.get('strong').contains('Group Description:').next().should('not.be.empty');
  });

  it('should allow editing group details for admin users', () => {
    cy.get('button').contains('Edit Details').click();
    
    cy.get('input[type="text"]').first().clear().type('UpdatedGroupName');
    cy.get('input[type="text"]').eq(1).clear().type('UpdatedGroupDescription');

    cy.get('button').contains('Save Details').click();

    cy.get('.alert-success', { timeout: 10000 }).should('contain.text', 'Group updated successfully!');

    cy.get('strong').contains('Group Name:').next().should('contain.text', 'UpdatedGroupName');
    cy.get('strong').contains('Group Description:').next().should('contain.text', 'UpdatedGroupDescription');
  });

  it('should not save changes if canceled in edit mode', () => {
    let originalName;
    cy.get('strong').contains('Group Name:').next().invoke('text').then((text) => {
      originalName = text.trim();
      cy.get('button').contains('Edit Details').click();
      
      cy.get('input[type="text"]').first().clear().type('CancelledGroupName');
      cy.get('button').contains('Cancel').click();

      cy.get('strong').contains('Group Name:').next().should('contain.text', originalName);
    });
  });


  it('should create a new channel', () => {
    cy.contains('Create Channel').scrollIntoView();
    
    // Enter channel name
    cy.get('input[type="text"]').eq(-2).clear().type('New Channel');
    
    // Enter channel description
    cy.get('input[type="text"]').last().clear().type('This is a new channel');

    cy.get('button').contains('Create').click();

    cy.get('.alert-success', { timeout: 10000 }).should('contain.text', 'Channel created successfully!');
    cy.contains('New Channel').should('exist');
    cy.contains('This is a new channel').should('exist');
  });

  it('should delete a channel', () => {
    cy.get('strong').first().invoke('text').then((channelName) => {
      cy.get('button').contains('Remove').first().click();

      cy.on('window:confirm', () => true);

      cy.get('.alert-success', { timeout: 10000 }).should('contain.text', 'Channel deleted successfully!');
      cy.contains(channelName).should('not.exist');
    });
  });
});