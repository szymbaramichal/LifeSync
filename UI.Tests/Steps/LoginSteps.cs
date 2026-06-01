using Reqnroll;
using UI.Tests.Dsl;
using UI.Tests.Infrastructure;

namespace UI.Tests.Steps;

[Binding]
public sealed class LoginSteps(
    LoginDsl loginDsl,
    LoginCredentialsProvider credentialsProvider,
    BrowserSession browserSession)
{
    [Given("the login page is open")]
    public async Task GivenTheLoginPageIsOpen()
    {
        await loginDsl.OpenLoginPageAsync();
    }

    [Given("the user enters valid credentials")]
    public async Task GivenTheUserEntersValidCredentials()
    {
        var credentials = LoginCredentialsProvider.GetCredentials();
        await loginDsl.EnterCredentialsAsync(credentials.Email, credentials.Password);
    }

    [When("the user submits the login form")]
    public async Task WhenTheUserSubmitsTheLoginForm()
    {
        await loginDsl.SubmitLoginAsync();
    }

    [Then("a login request should be sent")]
    public async Task ThenALoginRequestShouldBeSent()
    {
        await loginDsl.AssertLoginRequestWasSentAsync();
    }

    [Then("the user should be redirected to the dashboard")]
    public async Task ThenTheUserShouldBeRedirectedToTheDashboard()
    {
        await loginDsl.AssertRedirectedToCreateProfileAsync();
    }

    [AfterScenario]
    public async Task AfterScenarioAsync()
    {
        await browserSession.DisposeAsync();
    }
}
