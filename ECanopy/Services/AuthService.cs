using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
namespace ECanopy.Services
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task LoginAsync(LoginDto dto);
        Task LogoutAsync();
    }
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
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
                throw new BusinessException("Registration failed");

            // Every new user is a Resident by default
            await _userManager.AddToRoleAsync(user, "Resident");
        }

        // ===============================
        // LOGIN
        // ===============================
        public async Task LoginAsync(LoginDto dto)
        {
            var result = await _signInManager.PasswordSignInAsync(
                dto.Email,
                dto.Password,
                false,
                false);

            if (!result.Succeeded)
                throw new BusinessException("Invalid credentials");
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

    }
}
