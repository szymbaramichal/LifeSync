using System.Text.Json;

namespace UI.Tests.Infrastructure;

public sealed class LoginCredentialsProvider
{
    public static LoginCredentials GetCredentials()
    {
        var appSettingsPath = ResolveAppSettingsPath();
        var content = File.ReadAllText(appSettingsPath);
        using var document = JsonDocument.Parse(content);

        if (!document.RootElement.TryGetProperty("LoginCredentials", out var loginCredentials))
        {
            throw new InvalidOperationException(
                $"Missing 'LoginCredentials' section in '{appSettingsPath}'.");
        }

        var email = ReadRequiredString(loginCredentials, "Email", appSettingsPath);
        var password = ReadRequiredString(loginCredentials, "Password", appSettingsPath);
        return new LoginCredentials(email, password);
    }

    private static string ResolveAppSettingsPath()
    {
        var outputPath = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
        if (File.Exists(outputPath))
        {
            return outputPath;
        }

        var projectPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../appsettings.json"));
        if (File.Exists(projectPath))
        {
            return projectPath;
        }

        throw new FileNotFoundException(
            $"Could not find appsettings.json in '{outputPath}' or '{projectPath}'.");
    }

    private static string ReadRequiredString(JsonElement parent, string key, string appSettingsPath)
    {
        if (!parent.TryGetProperty(key, out var value) || value.ValueKind != JsonValueKind.String)
        {
            throw new InvalidOperationException(
                $"Missing string property 'LoginCredentials:{key}' in '{appSettingsPath}'.");
        }

        var text = value.GetString();
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new InvalidOperationException(
                $"Property 'LoginCredentials:{key}' in '{appSettingsPath}' cannot be empty.");
        }

        return text;
    }
}

public sealed record LoginCredentials(string Email, string Password);