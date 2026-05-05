using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace GigaChat.Infrastructure;

internal class LowerCaseStringEnumConverter : StringEnumConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        if (value == null)
        {
            writer.WriteNull();
            return;
        }

        var enumText = value.ToString();
        
        // Если есть атрибут EnumMember, используем его значение
        var enumType = value.GetType();
        var memberInfo = enumType.GetMember(enumText);
        if (memberInfo.Length > 0)
        {
            var enumMemberAttribute = memberInfo[0].GetCustomAttributes(typeof(System.Runtime.Serialization.EnumMemberAttribute), false);
            if (enumMemberAttribute.Length > 0)
            {
                enumText = ((System.Runtime.Serialization.EnumMemberAttribute)enumMemberAttribute[0]).Value;
            }
        }

        writer.WriteValue(enumText.ToLowerInvariant());
    }
}