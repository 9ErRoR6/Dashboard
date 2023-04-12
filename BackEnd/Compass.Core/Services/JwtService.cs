using Compass.Core.DTO_s;
using Compass.Core.Entities.Specification;
using Compass.Core.Entities;
using Compass.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Compass.Core.Services
{
    public class JwtService : IJwtTokenService
    {
        private readonly IConfiguration _configuration;
        private readonly IRepository<RefreshToken> _tokenRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenValidationParameters _tokenValidationParameters;
        public JwtService(UserManager<AppUser> userManager, IConfiguration configuration, TokenValidationParameters tokenValidationParameters, IRepository<RefreshToken> tokenRepo)
        {
            _configuration = configuration;
            _tokenValidationParameters = tokenValidationParameters;
            _userManager = userManager;
            _tokenRepo = tokenRepo;
        }

        public async Task Create(RefreshToken refreshToken)
        {
            await _tokenRepo.Insert(refreshToken);
            await _tokenRepo.Save();
        }

        public async Task Update(RefreshToken refreshToken)
        {
            await _tokenRepo.Update(refreshToken);
            await _tokenRepo.Save();
        }

        public async Task Delete(RefreshToken refreshToken)
        {
            await _tokenRepo.Delete(refreshToken);
            await _tokenRepo.Save();
        }

        public async Task<RefreshToken?> GetRefreshToken(string token)
        {
            var result = await _tokenRepo.GetListBySpec(new RefreshTokenSpecification.GetRefreshToken(token));
            return (RefreshToken?)result.FirstOrDefault();
        }

        public async Task<IEnumerable<RefreshToken>> GetAll()
        {
            IEnumerable<RefreshToken> result = await _tokenRepo.GetAll();
            return result;
        }
        public async Task<Tokens> GenerateJwtTokenAsync(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_configuration["JwtConfig:Secret"]);


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim("Id", user.Id),
                new Claim("Name", user.Name),
                new Claim("Surname", user.Surname),
                new Claim("Email", user.Email),
                new Claim("EmailConfirm", user.EmailConfirmed.ToString()),
                new Claim("PhoneNumber", user.PhoneNumber ?? ""),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, roles[0]),
                new Claim(JwtRegisteredClaimNames.Aud, _configuration["JwtConfig:Audience"]),
                new Claim(JwtRegisteredClaimNames.Iss, _configuration["JwtConfig:Issuer"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())

            }),
                Expires = DateTime.UtcNow.AddMinutes(5), // 5-10 minutes
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            var jwtToken = jwtTokenHandler.WriteToken(token);

            var refreshToken = new RefreshToken()
            {
                JwtId = token.Id,
                IsUsed = false,
                UserId = user.Id,
                AddedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddDays(1),
                IsRevoked = false,
                Token = RandomString(25) + Guid.NewGuid()
            };

            await Create(refreshToken);

            var tokens = new Tokens();
            tokens.token = jwtToken;
            tokens.refreshToken = refreshToken;

            return tokens;
        }

        public string RandomString(int length)
        {
            var random = new Random();
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<ServiceResponse> VerifyTokenAsync(TokenRequestDto tokenRequest)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            try
            {
                _tokenValidationParameters.ValidateLifetime = false;
                var principal = jwtTokenHandler.ValidateToken(tokenRequest.Token, _tokenValidationParameters, out var validatedToken);

                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase);

                    if (result == false)
                    {
                        return null;
                    }
                }

                // Will get the time stamp in unix time
                var utcExpiryDate = long.Parse(principal.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
                // we convert the expiry date from seconds to the date
                var expDate = UnixTimeStampToDateTime(utcExpiryDate);

                if (expDate > DateTime.UtcNow)
                {
                    return new ServiceResponse()
                    {
                        Errors = new List<string>() { "We cannot refresh this since the token has not expired" },
                        Success = false
                    };
                }

                // Check the token we got if its saved in the db
                //var storedRefreshToken = await _userRepository.CheckRefreshTokenAsync(tokenRequest.RefreshToken);
                var storedRefreshToken = await GetRefreshToken(tokenRequest.RefreshToken);

                if (storedRefreshToken == null)
                {
                    return new ServiceResponse()
                    {
                        Errors = new List<string>() { "refresh token doesnt exist" },
                        Success = false
                    };
                }

                // Check the date of the saved token if it has expired
                if (DateTime.UtcNow > storedRefreshToken.ExpiryDate)
                {
                    return new ServiceResponse()
                    {
                        Errors = new List<string>() { "Token has expired" },
                        Success = false
                    };
                }

                // check if the refresh token has been used
                if (storedRefreshToken.IsUsed)
                {
                    return new ServiceResponse()
                    {
                        Errors = new List<string>() { "token has been used" },
                        Success = false
                    };
                }

                // Check if the token is revoked
                if (storedRefreshToken.IsRevoked)
                {
                    return new ServiceResponse()
                    {
                        Errors = new List<string>() { "token has been revoked" },
                        Success = false
                    };
                }

                // we are getting here the jwt token id
                var jti = principal.Claims.SingleOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

                // check the id that the recieved token has against the id saved in the db
                if (storedRefreshToken.JwtId != jti)
                {
                    return new ServiceResponse()
                    {
                        Errors = new List<string>() { "the token doenst mateched the saved token" },
                        Success = false
                    };
                }

                storedRefreshToken.IsUsed = true;
                await Update(storedRefreshToken);

                var dbUser = await _userManager.FindByIdAsync(storedRefreshToken.UserId);

                var tokens = new Tokens();
                tokens = await GenerateJwtTokenAsync(dbUser);
                return
                    new ServiceResponse()
                    {
                        AccessToken = tokens.token,
                        RefreshToken = tokens.refreshToken.Token,
                        Success = true,
                        Message = "Token successfully updated."
                    };
            }
            catch (Exception ex)
            {
                return
                   new ServiceResponse()
                   {
                       Success = false,
                       Message = ex.Message
                   };
            }
        }
        private DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToUniversalTime();
            return dtDateTime;
        }
    }
    public class Tokens
    {
        public string token { get; set; }
        public RefreshToken refreshToken { get; set; }
    }
}
