# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar la solución y proyectos
COPY ApiSistemaGestionIntegralCP.sln ./
COPY SistemaVenta.API/ SistemaVenta.API/
COPY SistemaVenta.BLL/ SistemaVenta.BLL/
COPY SistemaVenta.DAL/ SistemaVenta.DAL/
COPY SistemaVenta.DTO/ SistemaVenta.DTO/
COPY SistemaVenta.Model/ SistemaVenta.Model/
COPY SistemaVenta.IOC/ SistemaVenta.IOC/
COPY SistemaVenta.Utility/ SistemaVenta.Utility/

# Restaurar dependencias
RUN dotnet restore ApiSistemaGestionIntegralCP.sln

# Publicar el proyecto principal
RUN dotnet publish "SistemaVenta.API/SistemaVenta.API.csproj" -c Release -o /app/publish

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "SistemaVenta.API.dll"]
