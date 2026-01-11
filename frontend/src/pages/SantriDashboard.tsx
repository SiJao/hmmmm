import { useState } from 'react';
import { UserProfile } from '../backend';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { ClipboardCheck, Send } from 'lucide-react';

interface SantriDashboardProps {
  profile: UserProfile;
}

export default function SantriDashboard({ profile }: SantriDashboardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: profile.name,
    idSantri: profile.idSantri,
    kelas: profile.kelas || '',
    tanggal: new Date().toISOString().split('T')[0],
    statusKehadiran: 'Hadir',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbw24x-uyRwP2PJBvNm_SntMFbgstizxoI_Z6LukL7uM1BOq6A35lBsu1axIwCtygwTH/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      toast.success('Absensi berhasil dikirim!', {
        description: `Status: ${formData.statusKehadiran} pada ${formData.tanggal}`,
      });

      setFormData({
        ...formData,
        tanggal: new Date().toISOString().split('T')[0],
        statusKehadiran: 'Hadir',
      });
    } catch (error) {
      toast.error('Gagal mengirim absensi', {
        description: 'Silakan coba lagi nanti',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout profile={profile} title="Dashboard Santri">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Form Absensi</CardTitle>
                <CardDescription>Isi absensi harian Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idSantri">ID Santri</Label>
                <Input
                  id="idSantri"
                  value={formData.idSantri}
                  onChange={(e) => setFormData({ ...formData, idSantri: e.target.value })}
                  required
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas</Label>
                <Input
                  id="kelas"
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  required
                  placeholder="Contoh: 1A, 2B, 3C"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusKehadiran">Status Kehadiran</Label>
                <Select
                  value={formData.statusKehadiran}
                  onValueChange={(value) => setFormData({ ...formData, statusKehadiran: value })}
                >
                  <SelectTrigger id="statusKehadiran">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hadir">Hadir</SelectItem>
                    <SelectItem value="Tidak Hadir">Tidak Hadir</SelectItem>
                    <SelectItem value="Izin">Izin</SelectItem>
                    <SelectItem value="Sakit">Sakit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Kirim Absensi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
