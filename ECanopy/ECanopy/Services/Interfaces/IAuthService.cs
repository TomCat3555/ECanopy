using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task LoginAsync(LoginDto dto);
    }
}
