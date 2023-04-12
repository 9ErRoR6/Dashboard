using Compass.Core.DTO_s;
using Compass.Core.Services;
using Compass.Core.Validation.Token;
using Compass.Core.Validation.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Compass.Api.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> InsertAsync([FromBody] RegisterUserDto model)
        {
            var validator = new RegisterValidation();
            var validationresult = await validator.ValidateAsync(model);
            if (validationresult.IsValid)
            {
                var result = await _userService.RegisterAsync(model);
                    return Ok(result);
            }
             return BadRequest(validationresult.Errors);
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LogInAsync([FromBody] LoginUserDto model)
        {
            var valdator = new LoginValidation();
            var validationresult = await valdator.ValidateAsync(model);
            if (validationresult.IsValid)
            {
                var result = await _userService.LoginAsync(model);
                    return Ok(result);
            }
            return BadRequest(validationresult.Errors);
        }
        [AllowAnonymous]
        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDto model)
        {
            var validator = new TokenRequestValidation();
            var validationResult = await validator.ValidateAsync(model);
            if (validationResult.IsValid)
            {
                var result = await _userService.RefreshTokenAsync(model);
                if (result.Success)
                {
                    return Ok(result);
                }
                return BadRequest(result);
            }
            else
            {
                return BadRequest(validationResult.Errors);
            }
        }
        [HttpGet("logout")]
        public async Task<IActionResult> LogoutAsync(string userId)
        {
            var result = await _userService.LogoutAsync(userId);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _userService.GetAll();
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        [HttpPost("editUserProfile")]
        public async Task<IActionResult> EditProfile([FromBody] EditUserProfileDto model)
        {
            var validator = new EditProfileValidation();
            var validationResult = await validator.ValidateAsync(model);
            if (validationResult.IsValid)
            {
                var result = await _userService.EditProfileAsync(model);
                if (result.Success)
                {
                    return Ok(result);
                }
                return BadRequest(result);
            }
            return BadRequest(validationResult.Errors);
        }
        [HttpPost("editUser")]
        public async Task<IActionResult> EditUser([FromBody] EditUserDto model)
        {
            var validator = new EditValidation();
            var validationResult = await validator.ValidateAsync(model);
            if (validationResult.IsValid)
            {
                var result = await _userService.EditAsync(model);
                if (result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }
            return BadRequest(validationResult.Errors);
        }
        [HttpPost("deleteUser")]
        public async Task<IActionResult> DeleteUserAsync([FromBody] string email)
        {
            var result = await _userService.DeleteUserAsync(email);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        [HttpPost("blockUser")]
        public async Task<IActionResult> BlockUserAsync([FromBody] string email)
        {
            var result = await _userService.BlockUserAsync(email);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [AllowAnonymous]
        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmailAsync([FromBody] ConfirmEmailDto model)
        {
            if (string.IsNullOrWhiteSpace(model.Id) || string.IsNullOrWhiteSpace(model.Token))
                return NotFound();

            var result = await _userService.ConfirmEmailAsync(model);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
