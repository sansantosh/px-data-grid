document.addEventListener('WebComponentsReady', () => {
  describe('column dropdown menu', () => {
    let grid;
    let firstNameHeaderCell;
    let lastNameHeaderCell;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          firstNameHeaderCell = getHeaderCell(grid, 0);
          lastNameHeaderCell = getHeaderCell(grid, 1);

          done();
        });
      });
    });

    it('should move the first frozen column to the left side of the grid', () => {
      expect(getHeaderCell(grid, 0)).to.equal(firstNameHeaderCell);
      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 0)).to.equal(lastNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
    });

    it('should move the second frozen column to the left side of the grid, before the first frozen', () => {
      expect(getHeaderCell(grid, 0)).to.equal(firstNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(lastNameHeaderCell);
      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);
      getHeaderCellContent(firstNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 0)).to.equal(firstNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(lastNameHeaderCell);
    });

    it('should not move the frozen column before selection column', () => {
      // Make selectable and check that columns are after selection column
      grid.selectionMode = 'multi';
      grid.hideSelectionColumn = false;
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
      expect(getHeaderCell(grid, 2)).to.equal(lastNameHeaderCell);

      // Free second data column, and check it's first after selection column
      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 1)).to.equal(lastNameHeaderCell);
      expect(getHeaderCell(grid, 2)).to.equal(firstNameHeaderCell);

      // Make unselectable, and check position of data columns
      grid.selectionMode = 'none';
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 0)).to.equal(lastNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
    });

    // TODO: @limonte investigate why 2 tests below don't work
    // it('should move the first unfrozen column right after last frozen', () => {
    //   getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._unfreezeColumn();
    //   expect(getHeaderCell(grid, 0)).to.equal(lastNameHeaderCell);
    //   expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
    // });

    // it('should not change columns order after unfrozing the only one frozen column', () => {
    //   getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._unfreezeColumn();
    //   getHeaderCellContent(lastNameHeaderCell)._unfreezeColumn();
    //   expect(getHeaderCell(grid, 0)).to.equal(lastNameHeaderCell);
    //   expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
    // });

    it('should hide the column', () => {
      getHeaderCellContent(firstNameHeaderCell)._hideColumn();
      expect(firstNameHeaderCell.hasAttribute('hidden')).to.be.true;
    });
  });
});
