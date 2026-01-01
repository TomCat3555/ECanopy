using ECanopy.Common;
using System.Net;
using System.Text.Json;

namespace ECanopy.MiddleWare
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException ex)
            {
                await Write(context, HttpStatusCode.NotFound, ex.Message);
            }
            catch (ForbiddenException ex)
            {
                await Write(context, HttpStatusCode.Forbidden, ex.Message);
            }
            catch (BusinessException ex)
            {
                await Write(context, HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception)
            {
                await Write(context, HttpStatusCode.InternalServerError,
                    "Internal server error");
            }
        }

        private static async Task Write(
            HttpContext context,
            HttpStatusCode status,
            string message)
        {
            context.Response.StatusCode = (int)status;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(new { error = message }));
        }
    }
}
