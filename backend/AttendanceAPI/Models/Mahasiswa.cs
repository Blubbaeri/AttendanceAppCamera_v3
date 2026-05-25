using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceAPI.Models
{
    [Table("mahasiswa")]
    public class Mahasiswa
    {
        [Key]
        [Column("nim_mhs")]
        public string NimMhs { get; set; }

        [Column("nama_mhs")]
        public string NamaMhs { get; set; }

        [Column("foto_mhs")]
        public byte[]? FotoMhs { get; set; }
    }
}