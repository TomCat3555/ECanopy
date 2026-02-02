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
        public DbSet<Notice> Notices { get; set; }

        public DbSet<ResidentJoinRequest> ResidentJoinRequests { get; set; }
        public DbSet<RwaMember> RwaMembers { get; set; }
        public DbSet<RoleRequest> RoleRequests { get; set; }

        public DbSet<Complaint> Complaints { get; set; } = null!;
        public DbSet<ComplaintComments> ComplaintComments { get; set; } = null!;
        public DbSet<ComplaintAttachment> ComplaintAttachments { get; set; } = null!;
        public DbSet<OwnershipRequest> OwnershipRequests { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Complaint>()
                .HasIndex(c => c.TicketNumber)
                .IsUnique();

            modelBuilder.Entity<Complaint>()
                .HasMany(c => c.Comments)
                .WithOne(cc => cc.Complaint)
                .HasForeignKey(cc => cc.ComplaintId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Complaint>()
                .HasMany(c => c.Attachments)
                .WithOne(ca => ca.Complaint)
                .HasForeignKey(ca => ca.ComplaintId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RwaMember>()
                .HasIndex(r => new { r.SocietyId, r.Role })
                .IsUnique()
                .HasFilter("[SocietyId] IS NOT NULL");

            modelBuilder.Entity<Society>()
                .OwnsOne(s => s.Address, a =>
                {
                    a.Property(p => p.State)
                    .HasConversion<string>();
                });

            modelBuilder.Entity<OwnershipRequest>()
                .HasOne(o => o.Resident)
                .WithMany()
                .HasForeignKey(o => o.ResidentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OwnershipRequest>()
                .HasOne(o => o.Flat)
                .WithMany()
                .HasForeignKey(o => o.FlatId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Resident>()
                .HasIndex(r => r.UserId)
                .IsUnique();

            modelBuilder.Entity<RwaMember>()
                .HasIndex(r => r.UserId)
                .IsUnique();

            modelBuilder.Entity<ResidentJoinRequest>()
                .HasIndex(r => r.UserId)
                .IsUnique()
                .HasFilter("[Status] = 'Pending'");

        }
    }
}
