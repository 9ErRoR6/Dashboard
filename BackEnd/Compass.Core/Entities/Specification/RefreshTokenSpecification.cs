using Ardalis.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Compass.Core.Entities.Specification
{
    public static class RefreshTokenSpecification
    {
        public class GetRefreshToken : Specification<RefreshToken>
        {
            public GetRefreshToken(string refreshToken)
            {
                Query.Where(x => x.Token == refreshToken);
            }
        }
    }
}
