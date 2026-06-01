using Microsoft.Playwright;

namespace UI.Tests.Infrastructure;

public sealed class BrowserSession : IAsyncDisposable
{
    private IPlaywright? _playwright;
    private IBrowser? _browser;
    private IBrowserContext? _browserContext;
    private IPage? _page;

    public async Task<IPage> GetPageAsync()
    {
        if (_page is not null)
        {
            return _page;
        }

        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = false,
            SlowMo = 500
        });
        _browserContext = await _browser.NewContextAsync();
        _page = await _browserContext.NewPageAsync();
        return _page;
    }

    public async ValueTask DisposeAsync()
    {
        if (_browserContext is not null)
        {
            await _browserContext.CloseAsync();
        }

        if (_browser is not null)
        {
            await _browser.CloseAsync();
        }

        _playwright?.Dispose();
    }
}
