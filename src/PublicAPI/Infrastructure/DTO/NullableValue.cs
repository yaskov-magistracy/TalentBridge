namespace Infrastructure.DTO;

/// <summary>
/// Используется для полей, которые могут честно быть `null`. Чтобы однозначно определить, передали `null` или с полем ничего не надо делать
/// </summary>
/// <remarks>
/// По идее аналог NullablePatch, но у того название слишком специфичное. Думаю можно везде заменить на этот класс, тк он универсален
/// </remarks>
public class NullableValue<T>
{
    public T? Value { get; set; }

    public NullableValue(T? value)
    {
        Value = value;
    }
}