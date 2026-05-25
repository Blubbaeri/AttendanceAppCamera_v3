using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AttendanceAPI.Models;
using AttendanceAPI.Data;

namespace AttendanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PresensiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PresensiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Presensi>>> Get()
        {
            return await _context.Presensi.OrderByDescending(p => p.Id).ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Presensi presensi)
        {
            try 
            {
                if (presensi == null)
                {
                    return BadRequest(new { message = "Data presensi kosong atau tidak valid." });
                }

                // Log data yang masuk buat debugging
                Console.WriteLine($"==> Data Masuk: NIM {presensi.NimMhs}, MK {presensi.KodeMk}");

                _context.Presensi.Add(presensi);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Presensi sukses dicatat ke Database.", data = presensi });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"==> ERROR: {ex.Message}");
                return StatusCode(500, new { message = "Gagal simpan ke DB: " + ex.Message });
            }
        }
    }
}
