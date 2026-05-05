using System.Reflection;
using DAL.AiChats;
using DAL.Assignments;
using DAL.Candidates;
using DAL.Employers;
using DAL.ExpertReviews;
using DAL.Experts;
using DAL.Solutions;
using DAL.Technologies;
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
    internal DbSet<AssignmentEntity> Assignments => Set<AssignmentEntity>();
    internal DbSet<TechnologyEntity> Technologies => Set<TechnologyEntity>();
    internal DbSet<SolutionEntity> Solutions => Set<SolutionEntity>();
    internal DbSet<ExpertReviewEntity> ExpertReviews => Set<ExpertReviewEntity>();
    internal DbSet<AiChatEntity> AiChats => Set<AiChatEntity>();
    internal DbSet<AiChatMessageEntity> AiChatMessages => Set<AiChatMessageEntity>();
}