using ECanopy.Common;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace ECanopy.Services
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task<string> LoginAsync(LoginDto dto);
    }

    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        // ===============================
        // REGISTER (DEFAULT RESIDENT)
        // ===============================
        public async Task RegisterAsync(RegisterDto dto)
        {
            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                throw new BusinessException("User already exists");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ",
                    result.Errors.Select(e => e.Description));

                throw new BusinessException("Registration failed");
            }

            // Every new user is a Resident by default
            await _userManager.AddToRoleAsync(user, "Resident");
        }

        // ===============================
        // LOGIN
        // ===============================
        public async Task<string> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                Console.WriteLine("LOGIN FAIL → USER NOT FOUND");
                throw new BusinessException("Invalid credentials");
            }

            var valid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!valid)
            {
                Console.WriteLine("LOGIN FAIL → USER NOT FOUND");
                throw new BusinessException("Invalid credentials");
            }

            return await GenerateJwtToken(user);
        }

        // ===============================
        // GENERATE JWT
        // ===============================
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName)
            };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
