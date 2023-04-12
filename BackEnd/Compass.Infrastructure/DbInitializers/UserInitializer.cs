using Compass.Core.Entities;
using Compass.Infrastructure.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Compass.Infrastructure.DbInitializers
{
    public class UserInitializer
    {
        public static async Task Seed(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                var _context = serviceScope.ServiceProvider.GetService<AppDbContext>();
                UserManager<AppUser> userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
                if (userManager.FindByEmailAsync("admin@email.com").Result == null)
                {
                    AppUser admin = new AppUser
                    {
                        UserName = "admin@email.com",
                        Email = "admin@email.com",
                        EmailConfirmed = true,
                        Name = "Admin name",
                        Surname = "Admin surname",
                        PhoneNumber = "+xx(xxx)xx-xx-xxx",
                        PhoneNumberConfirmed = true,
                    };

                    AppUser user = new AppUser
                    {
                        UserName = "user@email.com",
                        Email = "user@email.com",
                        EmailConfirmed = true,
                        Name = "User name",
                        Surname = "User surname",
                        PhoneNumber = "+xx(xxx)xx-xx-xxx",
                        PhoneNumberConfirmed = true,
                    };

                    await _context.Roles.AddRangeAsync(
                        new IdentityRole()
                        {
                            Name = "Administrators",
                            NormalizedName = "ADMINISTRATORS"
                        },
                        new IdentityRole()
                        {
                            Name = "User",
                            NormalizedName = "User"
                        }
                    );

                    await _context.SaveChangesAsync();

                    IdentityResult resultAdmin = userManager.CreateAsync(admin, "Qwerty-1").Result;
                    IdentityResult resultUser = userManager.CreateAsync(user, "Qwerty-1").Result;

                    if (resultAdmin.Succeeded)
                    {
                        userManager.AddToRoleAsync(admin, "Administrators").Wait();
                    }

                    if (resultUser.Succeeded)
                    {
                        userManager.AddToRoleAsync(user, "Teachers").Wait();
                    }
                }
            }
        }
    }
}
