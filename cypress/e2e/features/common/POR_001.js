
function portal(){
      cy.get('.setting-group').click()
      cy.url().should('include', '/SysSetting/systemSetting/manager')
      cy.get('.header img[alt="logo圖"]').click()
      cy.url().should('include', '/portal')
      cy.get('.contract-group').click()
      cy.url().should('include', '/SysSetting/contractManagement/overview')
      cy.get('.header img[alt="logo圖"]').click()
      cy.url().should('include', '/portal')
      cy.get('.user-group.d-flex.align-items-center.el-tooltip__trigger.el-tooltip__trigger').click()
      cy.get('.el-dropdown-menu__item').eq(0).click()
      cy.url().should('include', '/memberProfile')
      cy.get('.header img[alt="logo圖"]').click()
      cy.url().should('include', '/portal')

}
export {portal};