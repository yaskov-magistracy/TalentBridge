FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Запускать из родительской папки всех солюшенов (Докер не может работать с папками выше самого себя)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
# Сохраняем структуру папок в соответствии с ссылками на проекты в оригинале (чтобы не делать лишних `dotnet remove/add reference`)
WORKDIR /src
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["DAL/DAL.csproj", "DAL/"]
COPY ["API/API.csproj", "API/"]
COPY ["Application/Application.csproj", "Application/"]
RUN dotnet restore "API/API.csproj"
COPY ./Infrastructure ./Infrastructure
COPY ./Domain ./Domain
COPY ./DAL ./DAL
COPY ./API ./API
COPY ./Application ./Application
WORKDIR "/src/API"
RUN dotnet build "API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Создаём папку под статику
RUN mkdir -p _staticFiles 
ENTRYPOINT ["dotnet", "API.dll"]
