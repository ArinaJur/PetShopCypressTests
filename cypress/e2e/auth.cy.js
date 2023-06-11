// <reference types="cypress"/>
const id = Math.round(Math.random() * 1000000000000).toString();
const userInfo = {
    id: id,
    newPassword: "vvv",
    repeatPassword: "vvv",
    firstName: "Vvv",
    lastName: "Vvvvv",
    email: "Vvvvv@test.com",
    phone: "(+1)234-56-789",
    address1: "123 Main St",
    address2: " ",
    city: "city",
    state: "state",
    zip: 12345,
    country: "country"
};
const changePassword = {
    password: "bbb",
    repeatPassword: "bbb",
}

describe("User Sign Up, Login", () => {
    beforeEach("visit and Enter the Store", () => {
        cy.visitHomePage();
    });

    it("should show unauthenticated user the Sign-in option", () => {
        cy.get('#Menu #MenuContent a:nth-child(3)')
            .should("be.visible")
            .and("have.text", "Sign In");
    });

    it("should show unauthenticated user the Sign-up option", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.get('#Catalog')
            .should("be.visible")
            .and("include.text", "Need a user name and password?");
        cy.getByLink("/actions/Account.action?newAccountForm=").should("have.text", "Register Now!");
    });

    it("should show authenticated user the Sign-out option", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type("Tester1");
        cy.getByInput("password").click().clear().type("vvv");
        cy.getByInput("signon").click();
        cy.get('#Menu #MenuContent a:nth-child(3)')
            .should("be.visible")
            .and("have.text", "Sign Out");
    });

    it("should show authenticated user the My Account option", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type("Tester1");
        cy.getByInput("password").click().clear().type("vvv");
        cy.getByInput("signon").click();
        cy.get('#Menu #MenuContent a:nth-child(5)')
            .should("be.visible")
            .and("have.text", "My Account");
    });

    it("should show authenticated user the My Orders option", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type("Tester1");
        cy.getByInput("password").click().clear().type("vvv");
        cy.getByInput("signon").click();
        cy.getByLinkIncludes("editAccountForm").click();
        cy.getByLink("/actions/Order.action?listOrders=")
            .should("be.visible")
            .should("have.text", "My Orders");
    });

    it("should redirect unauthenticated user to Sign-in / Sign-up page", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.location("pathname").should("include", "/actions/Account.action");
        cy.getByInput("signon").should("have.value", "Login");
    });

    it("should redirect unauthenticated user to Sign-up page", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByLinkIncludes("newAccountForm").click();
        cy.location("pathname").should("include", "/actions/Account.action");
        cy.getByInput("newAccount").should("have.value", "Save Account Information");
    });

    it("should redirect user to the home page after login", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type("Tester1");
        cy.getByInput("password").click().clear().type("vvv");
        cy.getByInput("signon").click();
        cy.location("pathname").should("equal", "/actions/Catalog.action");
    });

    it.skip("should redirect user to the home page after sign-up", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByLinkIncludes("newAccountForm").click();
        cy.getByInput("username").type(userInfo.id);
        cy.getByInput("password").type(userInfo.newPassword);
        cy.getByInput("repeatedPassword").type(userInfo.repeatPassword);
        cy.getByInput("account.firstName").type(userInfo.firstName);
        cy.getByInput("account.lastName").type(userInfo.lastName);
        cy.getByInput("account.email").type(userInfo.email);
        cy.getByInput("account.phone").type(userInfo.phone);
        cy.getByInput("account.address1").type(userInfo.address1);
        cy.getByInput("account.address2").type(userInfo.address2);
        cy.getByInput("account.city").type(userInfo.country);
        cy.getByInput("account.state").type(userInfo.state);
        cy.getByInput("account.zip").type(userInfo.zip);
        cy.getByInput("account.country").type(userInfo.country);
        cy.getByInput("newAccount").click();
        cy.location("pathname").should("equal", "/actions/Catalog.action");
    });

    it("should redirect authenticated user to My Account page", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type("Tester1");
        cy.getByInput("password").click().clear().type("vvv");
        cy.getByInput("signon").click();
        cy.getByLinkIncludes("editAccountForm").click();
        cy.location("pathname").should("include", "/actions/Account.action");
        cy.getByInput("editAccount").should("have.value", "Save Account Information");
        cy.getByLink("/actions/Order.action?listOrders=").should("have.text", "My Orders")
    });

    it("should redirect authenticated user to My Orders page", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type("Tester1");
        cy.getByInput("password").click().clear().type("vvv");
        cy.getByInput("signon").click();
        cy.getByLinkIncludes("editAccountForm").click();
        cy.getByLinkIncludes("listOrders").click();
        cy.location("pathname").should("include", "/actions/Order.action");
    });

    it("should redirect user to the home page after logout", () => {
        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type("Tester1");
        cy.getByInput("password").click().clear().type("vvv");
        cy.getByInput("signon").click();
        cy.getByLinkIncludes("signoff").click();
        cy.location("pathname").should("equal", "/actions/Catalog.action");
    });
});

describe("E2E User Sign up, Login and Logout", () => {
    it('should allow a visitor to sign up, login and logout', () => {

        //Sign-up user
        cy.visitHomePage();
        cy.getByLinkIncludes("signonForm").click();

        cy.getByLinkIncludes("newAccountForm").click();
        cy.get('form h3')
            .then($els => {return Cypress._.map($els, 'innerText')})
            .should("deep.equal", [
                "User Information",
                "Account Information",
                "Profile Information"
            ]);
        cy.getByInput("username").type(userInfo.id);
        cy.getByInput("password").type(userInfo.newPassword);
        cy.getByInput("repeatedPassword").type(userInfo.repeatPassword);
        cy.getByInput("account.firstName").type(userInfo.firstName);
        cy.getByInput("account.lastName").type(userInfo.lastName);
        cy.getByInput("account.email").type(userInfo.email);
        cy.getByInput("account.phone").type(userInfo.phone);
        cy.getByInput("account.address1").type(userInfo.address1);
        cy.getByInput("account.address2").type(userInfo.address2);
        cy.getByInput("account.city").type(userInfo.country);
        cy.getByInput("account.state").type(userInfo.state);
        cy.getByInput("account.zip").type(userInfo.zip);
        cy.getByInput("account.country").type(userInfo.country);

        cy.getByLink("/actions/Order.action?listOrders=")
            .should("not.exist");

        cy.getByInput("newAccount")
            .should("be.visible")
            .should("have.value", "Save Account Information")
            .click();


        //Login user
        cy.get('#Menu #MenuContent a:nth-child(3)')
            .should("be.visible")
            .and("have.text", "Sign In");

        cy.getByLinkIncludes("signonForm").click();
        cy.getByInput("username").type(userInfo.id);
        cy.getByInput("password").click().clear().type(userInfo.newPassword);
        cy.getByInput("signon").click();

        cy.get('#Menu #MenuContent a:nth-child(3)')
            .should("be.visible")
            .and("have.text", "Sign Out");

        cy.get('#Menu #MenuContent a:nth-child(5)')
            .should("be.visible")
            .and("have.text", "My Account");


        //Confirm new account
        cy.getByLinkIncludes("editAccountForm=").click();

        cy.get('form table')
            .first()
            .find('tr:nth-child(1) td:nth-child(2)')
            .should("have.text", userInfo.id);
        cy.getByInput("password").should("be.empty");
        cy.getByInput("repeatedPassword").should("be.empty");
        cy.getByInput("account.firstName").should("have.value", userInfo.firstName);
        cy.getByInput("account.lastName").should("have.value", userInfo.lastName);
        cy.getByInput("account.email").should("have.value", userInfo.email);
        cy.getByInput("account.phone").should("have.value", userInfo.phone);
        cy.getByInput("account.address1").should("have.value", userInfo.address1);
        cy.getByInput("account.address2").should("be.empty");
        cy.getByInput("account.city").should("have.value", userInfo.country);
        cy.getByInput("account.state").should("have.value", userInfo.state);
        cy.getByInput("account.zip").should("have.value", userInfo.zip);

        cy.getByInput("editAccount")
            .should("be.visible")
            .should("have.value", "Save Account Information");

        cy.getByLink("/actions/Order.action?listOrders=")
            .should("be.visible")
            .should("have.text", "My Orders");


        //Order list is empty for new user
        cy.getByLinkIncludes("listOrders=").click();
        cy.get('table tbody tr').should("have.length", 1);
        cy.get('table tbody tr td').should("not.exist");


        //Logout user
        cy.getByLinkIncludes("signoff=").click();
        cy.get('#Menu #MenuContent a:nth-child(3)')
            .should("be.visible")
            .and("have.text", "Sign In");
        cy.get('#Menu #MenuContent a:nth-child(5)')
            .should("not.have.text", "My Account");
        cy.getByLinkIncludes("editAccountForm=").should("not.exist");
    });
});

