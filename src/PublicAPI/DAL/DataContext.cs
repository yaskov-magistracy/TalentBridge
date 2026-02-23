using System.Reflection;
using DAL.Candidates;
using DAL.Employers;
using DAL.Experts;
using Microsoft.EntityFrameworkCore;

namespace DAL;

public class DataContext(
    DbContextOptions options,
    DalConfig config
) : DbContext(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        options.UseNpgsql(
            config.ConnectionString,
            builder => { builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null); });
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetAssembly(typeof(DataContext))!);
    }
    
    internal DbSet<EmployerEntity> Employers => Set<EmployerEntity>();
    internal DbSet<CandidateEntity> Candidates => Set<CandidateEntity>();
    internal DbSet<ExpertEntity> Experts => Set<ExpertEntity>();
}