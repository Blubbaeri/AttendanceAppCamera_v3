namespace AttendanceAPI.Models
{
    public class Presensi
    {
        public int Id { get; set; }
        public string KodeMk { get; set; } = string.Empty;
        public string NimMhs { get; set; } = string.Empty;
        public string PertemuanKe { get; set; } = string.Empty; 
        public string Date { get; set; } = string.Empty;
        public string JamPresensi { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Ruangan { get; set; } = string.Empty;
    }
}
