using Microsoft.EntityFrameworkCore;
using AttendanceAPI.Models;

namespace AttendanceAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Presensi> Presensi { get; set; }
        public DbSet<Mahasiswa> Mahasiswa { get; set; }
    }
}