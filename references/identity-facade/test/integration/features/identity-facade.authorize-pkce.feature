@pkce @authorize
Feature:
  As a Client App
  I want to access the protected resource of an API
  So that I can retrieve different types of information

  Scenario: I should get an error if client_id is missing or invalid
    When I GET /authorize?client_id=xxx&redirect_uri=https://mocktarget.apigee.net/echo&response_type=code&state=12345&scope=openid%20email`pkceCodeVerifier`
    Then response code should be 401
    And response body should be valid json

  Scenario: I should get an error if client_id contains heading or trailing spaces
    When I GET /authorize?client_id=`spaceCharacters``clientId`&redirect_uri=https://mocktarget.apigee.net/echo&response_type=code&state=12345&scope=openid%20email`pkceCodeVerifier`
    Then response code should be 401
    And response body should be valid json

  Scenario: I should get an error if redirect_uri is missing or invalid
    When I GET /authorize?client_id=`clientId`&redirect_uri=https://example.com/invalid&response_type=code&state=12345&scope=openid%20email`pkceCodeVerifier`
    Then response code should be 400
    And response body path $.error should be invalid_request

  Scenario: I should get an error if response_type is missing or invalid
    Given I navigate to the authorize page with an invalid response type
    Then I am redirected to the Client App
    Then I receive an unsupported_response_type error

  Scenario: I should get an error if scope is missing
    Given I navigate to the authorize page without a scope parameter
    Then I am redirected to the Client App
    Then I receive an invalid_request error

  Scenario: User Authorizes with state missing
    Given I navigate to the authorize page without a state parameter
    When I sign in and consent
    Then I am redirected to the Client App
    And I receive an auth code in a query param
    And I store the auth code in global scope

  Scenario: I should get an error if code_challenge is missing
    Given I navigate to the authorize page without a pkce code challenge
    Then I am redirected to the Client App
    Then I receive an invalid_request error

  Scenario: I should get an error if code_challenge_method is missing
    Given I navigate to the authorize page without a pkce code challenge method
    Then I am redirected to the Client App
    Then I receive an invalid_request error

  Scenario: I should get an error if code_challenge_method is invalid
    Given I navigate to the authorize page with an invalid pkce code challenge method
    Then I am redirected to the Client App
    Then I receive an invalid_request error

  Scenario: User Authorizes
    Given I navigate to the authorize page
    When I sign in and consent
    Then I am redirected to the Client App
    And I receive an auth code in a query param
    And I store the auth code in global scope
    And I store the state parameter in global scope
