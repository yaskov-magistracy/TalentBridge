namespace DAL;

public class DatabaseAccessor(DataContext dataContext)
{
    public async Task RecreateDatabase()
    {
        await dataContext.Database.EnsureDeletedAsync();
        await dataContext.Database.EnsureCreatedAsync();
    }
}