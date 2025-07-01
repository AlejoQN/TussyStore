describe("Flujo de Login y Perfil", () => {
  it("permite iniciar sesión y navegar al perfil", () => {
    cy.visit("/login"); 
    cy.get('input[type="email"]').type("duvanalejandroc808@gmail.com");
    cy.get('input[type="password"]').type("Alejandro298");
    cy.get('button[type="submit"]').click();

    // Navegar al perfil
    cy.get('button[aria-label="Abrir menú de usuario"]').click();
    cy.contains("Mi perfil").click();
    cy.url().should("include", "/perfil");
    cy.contains("Mi perfil");
  });
});
