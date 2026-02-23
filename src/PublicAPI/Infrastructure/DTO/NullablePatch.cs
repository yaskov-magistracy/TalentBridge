namespace Infrastructure.DTO;

/// <summary>
/// Тк значение nullable, то не понятно, когда его не нужно обновлять, а когда нужно обновить и сделать реально `null` в БД.
/// Чтобы это определить решил ввести эту модельку.
/// Логика такая: Если модель передали, то нужно пропатчить значением изнутри, если не передали, то не надо
/// </summary>
public class NullablePatch<T>
{
    public T? Value { get; set; }

    public NullablePatch(T? value)
    {
        Value = value;
    }
}