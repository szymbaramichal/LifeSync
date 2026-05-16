using System.Text.RegularExpressions;
using Microsoft.Playwright;
using UITests.Infrastructure;

namespace UITests.Dsl;

public sealed class LoginDsl(BrowserSession browserSession)
{
    private IRequest? _loginRequest;

    public async Task OpenLoginPageAsync()
    {
        var page = await browserSession.GetPageAsync();
        await page.GotoAsync("http://localhost:4200/auth");
        await Assertions.Expect(page.GetByRole(AriaRole.Textbox, new() { Name = "Email" })).ToBeVisibleAsync();
        await Assertions.Expect(page.GetByRole(AriaRole.Textbox, new() { Name = "Password" })).ToBeVisibleAsync();
    }

    public async Task EnterCredentialsAsync(string email, string password)
    {
        var page = await browserSession.GetPageAsync();
        await page.GetByRole(AriaRole.Textbox, new() { Name = "Email" }).FillAsync(email);
        await page.GetByRole(AriaRole.Textbox, new() { Name = "Password" }).FillAsync(password);
    }

    public async Task SubmitLoginAsync()
    {
        var page = await browserSession.GetPageAsync();
        _loginRequest = await page.RunAndWaitForRequestAsync(
            async () => await page.GetByRole(AriaRole.Button, new() { Name = "Login" }).ClickAsync(),
            request => request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase) &&
                       request.Url.Contains("accounts:signInWithPassword", StringComparison.OrdinalIgnoreCase));
    }

    public Task AssertLoginRequestWasSentAsync()
    {
        if (_loginRequest is null)
        {
            throw new InvalidOperationException("No login request was captured.");
        }

        return Task.CompletedTask;
    }

    public async Task AssertRedirectedToCreateProfileAsync()
    {
        var page = await browserSession.GetPageAsync();
        await Assertions.Expect(page).ToHaveURLAsync(new Regex(".*/create-profile.*", RegexOptions.IgnoreCase));
    }
}