describe('Channel Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input#username').type('john_doe');
    cy.get('input#password').type('pw');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profile');
    cy.visit('/group/64e09ba4f40c4b8f9d5f9f9e/channel/78909ba4f40c4b8f9d5f9f9e');
  });

  it('should display the channel details correctly', () => {
    cy.get('h1.display-5', { timeout: 10000 }).should('be.visible').and('contain.text', 'Welcome to');
    cy.get('p.lead').should('not.be.empty');
  });

  it('should display a list of channel members', () => {
    cy.contains('Members', { timeout: 10000 }).should('be.visible');
    cy.get('.member-item').should('have.length.at.least', 1);
  });

  it('should allow removing a member from the channel', () => {
    cy.get('button.btn-danger').contains('Remove').first().click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('User removed from channel successfully!');
    });
  });

  it('should allow sending a text message', () => {
    cy.get('#messagecontent').type('Hello, everyone!');
    cy.get('button').contains('Send Message').click();
    cy.contains('Hello, everyone!').should('be.visible');
  });

  it('should display the video component', () => {
    cy.get('app-video').should('exist');
  });
});
