describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

it('Then: I can add a book to my reading list and undo the action', () => {
  // Search for a book
  cy.get('[data-testing="search-input"]').type('JavaScript');
  cy.get('[data-testing="search-button"]').click();

  // Add the first book from the search result to the reading list
  cy.get('[data-testing="book-item"]').first().within(() => {
    cy.get('[data-testing="add-to-reading-list"]').click();
  });

  // Verify the Snackbar message appears
  cy.get('.mat-snack-bar-container').should('contain.text', 'Added "JavaScript" to reading list');

  // Verify the book appears in the reading list
  cy.get('[data-testing="toggle-reading-list"]').click();
  cy.get('[data-testing="reading-list-container"]').should('contain.text', 'JavaScript');

  // Click Undo in the snackbar
  cy.get('.mat-snack-bar-container button').contains('Undo').click();

  // Verify the book is removed from the reading list
  cy.get('[data-testing="reading-list-container"]').should('not.contain.text', 'JavaScript');
});
});
