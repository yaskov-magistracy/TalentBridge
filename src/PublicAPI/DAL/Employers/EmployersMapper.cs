using DAL.Solutions;
using Domain.Employers;
using Domain.Employers.DTO;

namespace DAL.Employers;

internal static class EmployersMapper
{
    public static Employer ToDomain(EmployerEntity entity)
        => new(entity.Id, entity.Login, entity.Name, entity.Email, entity.PhoneNumber, entity.SiteUrl);
    
    public static EmployerFull ToDomainFull(EmployerEntity entity)
        => new(
            entity.Id,
            entity.Login,
            entity.Name,
            entity.Email,
            entity.PhoneNumber,
            entity.SiteUrl,
            entity.Assignments?.Count ?? 0,
            entity
                .Assignments?.Sum(a =>
                    a.Solutions?.Count(s => s.State == SolutionEntityState.Done) ?? 0)
                ?? 0);

    public static EmployerEntity ToEntity(EmployerCreateEntity createEntity)
        => new()
        {
            Login = createEntity.Login,
            PasswordHash = createEntity.PasswordHash,
            Name = createEntity.Name,
            Email = createEntity.Email,
            PhoneNumber = createEntity.PhoneNumber,
            SiteUrl = createEntity.SiteUrl,
        };
}