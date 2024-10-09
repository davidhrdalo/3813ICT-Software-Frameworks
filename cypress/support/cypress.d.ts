// cypress/support/index.d.ts
declare namespace Cypress {
    interface Window {
      socketService: any;  // You can replace 'any' with the appropriate type for your socketService
    }
  }
  