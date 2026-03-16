using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace DAL;

public static class EfCoreExtensions
{
    extension<TEntity>(DbSet<TEntity> set) where TEntity : class, IEntity
    {
        public void AttachRangeIfNotEmpty(List<TEntity>? entities)
        {
            if (entities == null || entities.Count == 0)
                return;
        
            set.AttachRange(entities);
        }

        public void AttachRangeIfNecessary(
            List<TEntity>? alreadyAttached,
            List<TEntity>? toAttach
        )
        {
            if (alreadyAttached == null 
                || toAttach == null 
                || toAttach.Count == 0)
                return;

            toAttach = toAttach
                .Where(e => alreadyAttached.All(e2 => e2.Id != e.Id))
                .ToList();
            set.AttachRange(toAttach);
        }
    }
    
    extension<TEntity>(IQueryable<TEntity> query) where TEntity : class, IEntity
    {
        // TODO докрутить через expr
        public IQueryable<TEntity> WhereILike(Func<TEntity, string> fieldSelector, string toSearch)
            => query.Where(e => EF.Functions.ILike(fieldSelector(e), $"%{toSearch}%"));
    }
}