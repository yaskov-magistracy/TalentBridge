using System.Text.Json.Serialization;

namespace GigaChat.Files.Response;

/// <summary>
/// Описание файла, доступного в хранилище.
/// </summary>
public class GigaChatFileItem
{
    /// <summary>
    /// Идентификатор файла.
    /// </summary>
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    /// <summary>
    /// Тип объекта.
    /// </summary>
    [JsonPropertyName("object")]
    public string Object { get; set; }

    /// <summary>
    /// Размер файла в байтах.
    /// </summary>
    [JsonPropertyName("bytes")]
    public int Bytes { get; set; }

    /// <summary>
    /// Время создания файла в формате unix timestamp.
    /// </summary>
    [JsonPropertyName("created_at")]
    public long CreatedAt { get; set; }

    /// <summary>
    /// Название файла.
    /// </summary>
    [JsonPropertyName("filename")]
    public string Filename { get; set; }

    /// <summary>
    /// Назначение файла (general).
    /// </summary>
    [JsonPropertyName("purpose")]
    public string Purpose { get; set; }

    /// <summary>
    /// Доступность файла (public / private).
    /// </summary>
    [JsonPropertyName("access_policy")]
    public string AccessPolicy { get; set; }

    /// <summary>
    /// Модальность файла, например, image.
    /// </summary>
    [JsonPropertyName("modalities")]
    public string[]? Modalities { get; set; }
}
