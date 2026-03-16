using Infrastructure.DTO;

namespace DAL;

public static class RelationsPatchExtensions
{
    extension<TEntity>(RelationsPatch relationsPatch) where TEntity : IEntity, new()
    {
        public int ApplyRemove(List<TEntity>? target)
        {
            if (target == null
                || target.Count == 0
                || relationsPatch.ToRemove == null
                || relationsPatch.ToRemove.Count == 0)
                return 0;
            
            return target.RemoveAll(e => relationsPatch.ToRemove.Contains(e.Id));
        }

        public (List<TEntity> result, List<TEntity> added) ApplyAdd(List<TEntity>? target)
        {
            target ??= [];
            if (relationsPatch.ToAdd == null || relationsPatch.ToAdd.Count == 0)
                return (target, []);

            var toAdd = relationsPatch.ToAdd
                .Where(id => target.All(entity => entity.Id != id))
                .Select(e => new TEntity()
                {
                    Id = e
                })
                .ToList();
            target.AddRange(toAdd);
            return (target, toAdd);
        }
    }
}