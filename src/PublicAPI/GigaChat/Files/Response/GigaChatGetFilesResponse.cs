namespace GigaChat.Files.Response;

/// <summary>
/// Ответ метода GET /files — массив объектов с данными доступных файлов.
/// </summary>
public class GigaChatGetFilesResponse
{
    /// <summary>
    /// Массив файлов.
    /// </summary>
    public GigaChatFileItem[] Data { get; set; }
}
