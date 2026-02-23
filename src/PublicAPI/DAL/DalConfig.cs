using Infrastructure;

namespace DAL;

public class DalConfig
{
    public string ConnectionString { get; set; }

    public DalConfig()
    {
        ConnectionString = ConfigReader.GetVar<string>("DATABASE_CONNECTION_STRING");
    }
}