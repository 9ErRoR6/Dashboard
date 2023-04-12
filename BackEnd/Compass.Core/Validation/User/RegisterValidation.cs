using Compass.Core.DTO_s;
using DotLiquid.Util;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Compass.Core.Validation.User
{
    public class RegisterValidation: AbstractValidator<RegisterUserDto>
    {
        public RegisterValidation()
        {
            RuleFor(r => r.Name).NotEmpty();
            RuleFor(r => r.Surname).NotEmpty();
            RuleFor(r => r.Email).NotEmpty().EmailAddress();
            RuleFor(r => r.Password).NotEmpty().MinimumLength(6);
            RuleFor(r => r.ConfirmPassword).NotEmpty().MinimumLength(6);
            RuleFor(r => r.ConfirmPassword).Equal(x => x.Password);
            RuleFor(r => r.Role).NotEmpty();
        }
        
    }
}
