using Domain.Employers;
using Domain.Employers.DTO;

namespace DAL.Employers;

internal static class EmployersMapper
{
    public static Employer ToDomain(EmployerEntity entity)
        => new(entity.Id, entity.Login);

    public static EmployerEntity ToEntity(EmployerCreateEntity createEntity)
        => new()
        {
            Login = createEntity.Login,
            PasswordHash = createEntity.PasswordHash,
        };
}