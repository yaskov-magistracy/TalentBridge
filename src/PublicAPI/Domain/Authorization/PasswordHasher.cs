using System.Security.Cryptography;

namespace Domain.Authorization;

public interface IPasswordHasher
{
    public string HashPassword(string password);
    public bool VerifyPassword(string password, string hashedPassword);
}

public class PasswordHasher() : IPasswordHasher
{
    private const int HashAlgIterationsCount = 10000;
    
    public string HashPassword(string password)
    {
        if (string.IsNullOrEmpty(password))
            throw new ArgumentNullException(nameof(password), "Password is empty");
        var salt = new byte[16]; // TODO: get from config
        RandomNumberGenerator.Fill(salt);

        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, HashAlgIterationsCount, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(20);

        var hashBytes = new byte[salt.Length + hash.Length];
        Array.Copy(salt, 0, hashBytes, 0, salt.Length);
        Array.Copy(hash, 0, hashBytes, salt.Length, hash.Length);

        return Convert.ToBase64String(hashBytes);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        var hashBytes = Convert.FromBase64String(hashedPassword);
        var salt = new byte[16];
        Array.Copy(hashBytes, 0, salt, 0, salt.Length);

        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, HashAlgIterationsCount, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(20);

        return !hash
            .Where((t, i) => hashBytes[i + salt.Length] != t)
            .Any();
    }
}