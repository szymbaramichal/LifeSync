using Reqnroll;
using Reqnroll.BoDi;
using UITests.Dsl;
using UITests.Infrastructure;

namespace UITests.Steps;

[Binding]
public sealed class DependencyRegistrationHooks
{
    [BeforeScenario(Order = 0)]
    public static void RegisterDependencies(IObjectContainer container)
    {
        container.RegisterTypeAs<BrowserSession, BrowserSession>();
        container.RegisterTypeAs<LoginDsl, LoginDsl>();
        container.RegisterTypeAs<LoginCredentialsProvider, LoginCredentialsProvider>();
    }
}
