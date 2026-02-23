using System.Globalization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Infrastructure.Configuration.Routes.ModelBinding;

public class DateOnlyModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var modelName = bindingContext.ModelName;
        var valueProviderResult = bindingContext.ValueProvider.GetValue(modelName);
        if (valueProviderResult == ValueProviderResult.None)
            return Task.CompletedTask;

        bindingContext.ModelState.SetModelValue(modelName, valueProviderResult);
        var value = valueProviderResult.FirstValue;
        if (string.IsNullOrEmpty(value))
            return Task.CompletedTask;

        if (DateOnlyParser.TryParse(value, out var date))
            bindingContext.Result = ModelBindingResult.Success(date);
        else
            bindingContext.ModelState.TryAddModelError(modelName, $"Invalid date format. Use one of: {{{string.Join("; ", DateOnlyParser.ParseFormats)}}}.");

        return Task.CompletedTask;
    }
}