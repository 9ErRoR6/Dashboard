using AutoMapper;
using Compass.Core.DTO_s;
using Compass.Core.Entities;
using DotLiquid;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Compass.Core.Services
{
    public class UserService
    {
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly JwtService _jwtService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        public UserService(IMapper mapper, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, JwtService jwtService, EmailService emailService, IConfiguration configuration)
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<ServiceResponse> RegisterAsync(RegisterUserDto model)
        {
            var mappedUser = _mapper.Map<AppUser>(model);
            var result = await _userManager.CreateAsync(mappedUser, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(mappedUser, model.Role);
                await SendConfirmationEmailAsync(mappedUser);
                return new ServiceResponse
                {
                    Success = true,
                    Message = "User successfully created.",
                };
            }
            else
            {

                return new ServiceResponse
                {
                    Success = false,
                    Message = result.Errors.Select(e => e.Description).FirstOrDefault()
                };
            }
        }
        public async Task<ServiceResponse> LoginAsync(LoginUserDto model)
        {
            AppUser user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "Login or password incorrect."
                };
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, lockoutOnFailure: true);
            if (result.Succeeded)
            {
                var tokens = await _jwtService.GenerateJwtTokenAsync(user);
                return new ServiceResponse
                {
                    AccessToken = tokens.token,
                    RefreshToken = tokens.refreshToken.Token,
                    Success = true,
                    Message = "User logged in successfully."
                };
            }

            if (result.IsNotAllowed)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "Confirm your email please."
                };
            }

            if (result.IsLockedOut)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "Your account is locked. Connect with administrator."
                };
            }

            return new ServiceResponse
            {
                Success = false,
                Message = "User or password incorrect."
            };
        }
        public async Task<ServiceResponse> LogoutAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }
            IEnumerable<RefreshToken> tokens = await _jwtService.GetAll();
            foreach (RefreshToken token in tokens)
            {
                await _jwtService.Delete(token);
            }

            return new ServiceResponse
            {
                Success = true,
                Message = "User successfully logged out."
            };
        }
        public async Task<ServiceResponse> GetAll()
        {
            List<AppUser> users = await _userManager.Users.ToListAsync();
            List<AllUsersDto> mappedUsers = users.Select(u => _mapper.Map<AppUser, AllUsersDto>(u)).ToList();
            for (int i = 0; i < users.Count; i++)
            {
                mappedUsers[i].Role = (await _userManager.GetRolesAsync(users[i])).FirstOrDefault();
            }

            return new ServiceResponse
            {
                Success = true,
                Message = "All users loaded.",
                Payload = mappedUsers
            };
        }
        public async Task<ServiceResponse> RefreshTokenAsync(TokenRequestDto model)
        {
            return await _jwtService.VerifyTokenAsync(model);
        }
        public async Task<ServiceResponse> GetByAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            var mappedUser = _mapper.Map<AppUser, EditUserProfileDto>(user);
            return new ServiceResponse
            {
                Success = true,
                Message = "User loaded.",
                Payload = mappedUser
            };
        }
        public async Task<ServiceResponse> EditProfileAsync(EditUserProfileDto model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            user.Name = model.Name;
            user.Surname = model.Surname;
            user.PhoneNumber = model.PhoneNumber;
            if (user.Email != model.Email)
            {
                user.Email = model.Email;
                user.UserName = model.Email;
                user.EmailConfirmed = false;
            }


            var result = await _userManager.UpdateAsync(user);
            await SendConfirmationEmailAsync(user);
            if (result.Succeeded)
            {
                IEnumerable<RefreshToken> tokens = await _jwtService.GetAll();
                foreach (RefreshToken token in tokens)
                {
                    await _jwtService.Delete(token);
                }
                var newTokens = await _jwtService.GenerateJwtTokenAsync(user);
                return new ServiceResponse
                {
                    AccessToken = newTokens.token,
                    RefreshToken = newTokens.refreshToken.Token,
                    Success = true,
                    Message = "User successfully updated."
                };
            }

            List<IdentityError> errorList = result.Errors.ToList();
            string errors = "";

            foreach (var error in errorList)
            {
                errors = errors + error.Description.ToString();
            }

            return new ServiceResponse
            {
                Success = false,
                Message = errors
            };
        }
        public async Task<ServiceResponse> EditAsync (EditUserDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.OldEmail);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            user.Name = model.Name;
            user.Surname = model.Surname;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            if (user.Email != model.OldEmail)
            {
                user.Email = model.Email;
                user.UserName = model.Email;
                user.EmailConfirmed = false;
                await SendConfirmationEmailAsync(user);
            }


            await _userManager.UpdateAsync(user);

            return new ServiceResponse
            {
                Success = true,
                Message = "Profile updated!"
            };

        }
        public async Task<ServiceResponse> DeleteUserAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            var res = await _userManager.DeleteAsync(user);

            return new ServiceResponse
            {
                Success = true,
                Message = "User deleted."
            };
        }
        public async Task<ServiceResponse> BlockUserAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            if (await _userManager.IsLockedOutAsync(user))
            {
                await _userManager.SetLockoutEndDateAsync(user, DateTime.Now);
            }
            else
            {
                await _userManager.SetLockoutEndDateAsync(user, DateTime.Now.AddYears(5));
            }

            return new ServiceResponse
            {
                Success = true,
                Message = "User blocked or unblocked."
            };
        }
        public async Task SendConfirmationEmailAsync(AppUser newUser)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);

            var encodedEmailToken = Encoding.UTF8.GetBytes(token);
            var validEmailToken = WebEncoders.Base64UrlEncode(encodedEmailToken);



            string url = $"{_configuration["HostSettings:URL"]}/confirmEmail?userid={newUser.Id}&token={validEmailToken}";

            string emailBody = $"<h1>Confirm your email</h1> <a href='{url}'>Confirm now</a>";
            await _emailService.SendEmailAsync(newUser.Email, "Email confirmation.", emailBody);
        }

        public async Task<ServiceResponse> ConfirmEmailAsync(ConfirmEmailDto model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
            {
                return new ServiceResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            try
            {
                var token = WebEncoders.Base64UrlDecode(model.Token);
                var res = await _userManager.ConfirmEmailAsync(user, Encoding.UTF8.GetString(token));
                if (res.Succeeded)
                {
                    return new ServiceResponse
                    {
                        Success = true,
                        Message = "Email confirmed!"
                    };
                }
            }
            catch { }
            return new ServiceResponse
            {
                Success = false,
                Message = "Invalid token."
            };

        }

    }
}
