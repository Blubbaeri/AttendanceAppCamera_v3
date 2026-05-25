using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AttendanceAPI.Data;
using AttendanceAPI.Models;

namespace AttendanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MahasiswaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MahasiswaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/mahasiswa/{nim}
        [HttpGet("{nim}")]
        public async Task<IActionResult> GetMahasiswa(string nim)
        {
            var mahasiswa = await _context.Mahasiswa
                .FirstOrDefaultAsync(m => m.NimMhs == nim);

            if (mahasiswa == null)
            {
                return NotFound(new
                {
                    message = "Mahasiswa tidak ditemukan"
                });
            }

            return Ok(new
            {
                nimMhs = mahasiswa.NimMhs,
                namaMhs = mahasiswa.NamaMhs,
                fotoMhs = mahasiswa.FotoMhs != null
                    ? Convert.ToBase64String(mahasiswa.FotoMhs)
                    : null
            });
        }

        // POST: api/mahasiswa/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadProfile(
            [FromForm] string nim,
            [FromForm] string nama,
            [FromForm] IFormFile foto)
        {
            try
            {
                var mahasiswa = await _context.Mahasiswa
                    .FirstOrDefaultAsync(m => m.NimMhs == nim);

                if (mahasiswa == null)
                {
                    mahasiswa = new Mahasiswa
                    {
                        NimMhs = nim,
                        NamaMhs = nama
                    };

                    _context.Mahasiswa.Add(mahasiswa);
                }

                mahasiswa.NamaMhs = nama;

                if (foto != null)
                {
                    using var memoryStream = new MemoryStream();
                    await foto.CopyToAsync(memoryStream);

                    mahasiswa.FotoMhs = memoryStream.ToArray();
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Foto profil berhasil disimpan"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Gagal upload foto",
                    error = ex.Message
                });
            }
        }
    }
}