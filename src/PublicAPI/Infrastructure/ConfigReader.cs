namespace Infrastructure;

public static class ConfigReader
{
    private const string PathToConfig = "../dev.conf";
    private const string PathToSecretConfig = "../secrets.conf";
    
    public static T GetVar<T>(string envName)
    {
        var str = Environment.GetEnvironmentVariable(envName)
                  ?? ParseFromLocalFile(localSecretEnvVars.Value, envName)
                  ?? ParseFromLocalFile(localPublicEnvVars.Value, envName);
        var value = Convert.ChangeType(str, typeof(T));
        if (value == null)
            throw new NotImplementedException($"Can not parse Config var: {nameof(envName)} of type: {nameof(T)}");

        return (T)value;
    }

    private static string? ParseFromLocalFile(Dictionary<string, string> localEnvVars, string envName)
        => localEnvVars.GetValueOrDefault(envName);

    private static Lazy<Dictionary<string, string>> localPublicEnvVars = new(() =>
    {
        return File.ReadAllLines(PathToConfig)
            .Select(e => e.Trim())
            .Where(e => !string.IsNullOrEmpty(e))
            .Select(e => e.Split(" = "))
            .ToDictionary(e => e.First(), e => e.Last());
    });
    
    private static Lazy<Dictionary<string, string>> localSecretEnvVars = new(() =>
    {
        return File.ReadAllLines(PathToSecretConfig)
            .Select(e => e.Trim())
            .Where(e => !string.IsNullOrEmpty(e))
            .Select(e => e.Split(" = "))
            .ToDictionary(e => e.First(), e => e.Last());
    });
}