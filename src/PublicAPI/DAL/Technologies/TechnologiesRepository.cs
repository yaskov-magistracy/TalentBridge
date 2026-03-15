using Domain.Technologies;
using Domain.Technologies.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.Technologies;

public class TechnologiesRepository(
    DataContext dataContext
) : ITechnologiesRepository
{
    private DbSet<TechnologyEntity> Technologies => dataContext.Technologies;
    private IQueryable<TechnologyEntity> TechnologiesSearch => Technologies.AsNoTracking();
    
    public async Task<Technology?> Get(Guid id)
    {
        var existed = await TechnologiesSearch.FirstOrDefaultAsync(e => e.Id == id);
        return existed != null
            ? TechnologiesMapper.ToDomain(existed)
            : null;
    }

    public async Task<TechnologySearchResponse> Search(TechnologySearchRequest request)
    {
        var query = TechnologiesSearch;
        
        if(request.Name != null)
            query = query.Where(e => e.Name.Contains(request.Name));

        var count = await query.CountAsync();
        return new(
            query.Skip(request.Skip).Take(request.Take).AsEnumerable().Select(TechnologiesMapper.ToDomain).ToList(),
            count);
    }

    public async Task<Technology> Add(TechnologyCreateEntity createEntity)
    {
        var toAdd = TechnologiesMapper.ToEntity(createEntity);
        Technologies.Add(toAdd);
        await dataContext.SaveChangesAsync();
        return TechnologiesMapper.ToDomain(toAdd);
    }

    public async Task AddBatch(TechnologyCreateEntity[] createEntities)
    {
        var toAdd = createEntities.Select(TechnologiesMapper.ToEntity).ToArray();
        Technologies.AddRange(toAdd);
        await dataContext.SaveChangesAsync();
    }

    public async Task<Technology> Update(Guid id, TechnologyUpdateEntity updateEntity)
    {
        var existed = await Technologies.FirstAsync(e => e.Id == id);
        
        if (updateEntity.Name != null)
            existed.Name = updateEntity.Name;

        await dataContext.SaveChangesAsync();
        return TechnologiesMapper.ToDomain(existed);
    }
}