using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ECanopy.Models;

namespace ECanopy.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Society> Societies { get; set; }
        public DbSet<Building> Buildings { get; set; }
        public DbSet<Flat> Flats { get; set; }
        public DbSet<Resident> Residents { get; set; }

        public DbSet<MaintainanceBill> MaintainanceBills { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Notice> Notices { get; set; }

        public DbSet<ResidentJoinRequest> ResidentJoinRequests { get; set; }
        public DbSet<RwaMember> RwaMembers { get; set; }
        public DbSet<RoleRequest> RoleRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RwaMember>()
                .HasIndex(r => new { r.UserId, r.SocietyId })
                .IsUnique();
        }

    }
}
