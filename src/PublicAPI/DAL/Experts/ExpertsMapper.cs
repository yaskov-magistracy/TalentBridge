using DAL.Employers;
using Domain.Experts;
using Domain.Experts.DTO;

namespace DAL.Experts;

internal static class ExpertsMapper
{
    public static ExpertEntity ToEntity(ExpertCreateEntity createEntity) => new()
    {
        Login = createEntity.Login,
        PasswordHash =  createEntity.PasswordHash,
        Surname = createEntity.Surname,
        Name = createEntity.Name,
        Patronymic = createEntity.Patronymic,
        Employer = new EmployerEntity()
        {
            Id = createEntity.EmployerId
        },
    };

    public static Expert ToDomain(ExpertEntity entity)
        => new(
            entity.Id,
            entity.Surname, 
            entity.Name,
            entity.Patronymic);

    public static ExpertFullInfo ToDomainFull(ExpertEntity entity)
        => new(
            entity.Id,
            entity.Surname,
            entity.Name,
            entity.Patronymic, 
            EmployersMapper.ToDomain(entity.Employer));
}