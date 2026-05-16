Feature: Login
  As a LifeSync user
  I want to log in from the auth page
  So that I can access my dashboard

  Scenario: Successful login with valid credentials
    Given the login page is open
    And the user enters valid credentials
    When the user submits the login form
    Then a login request should be sent
    And the user should be redirected to the dashboard