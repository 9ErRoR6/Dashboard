using Compass.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Compass.Core.Interfaces
{
    internal interface IJwtTokenService
    {

        Task Create(RefreshToken refreshToken);
        Task Update(RefreshToken refreshToken);
        Task Delete(RefreshToken refreshToken);
        Task<IEnumerable<RefreshToken>> GetAll();
        Task<RefreshToken?> GetRefreshToken(string token);
    }
}
