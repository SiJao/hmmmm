import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Role } from '../backend';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSetupModal({ isOpen, onClose }: ProfileSetupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    idSantri: '',
    kelas: '',
    role: Role.santri,
  });

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.idSantri) {
      toast.error('Mohon lengkapi data yang diperlukan');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: formData.name,
        idSantri: formData.idSantri,
        kelas: formData.kelas || undefined,
        role: formData.role,
      });
      toast.success('Profil berhasil disimpan!');
      onClose();
    } catch (error: any) {
      toast.error('Gagal menyimpan profil', {
        description: error.message || 'Silakan coba lagi',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Lengkapi Profil Anda</DialogTitle>
          <DialogDescription>
            Silakan isi informasi berikut untuk melanjutkan
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idSantri">ID Santri *</Label>
            <Input
              id="idSantri"
              value={formData.idSantri}
              onChange={(e) => setFormData({ ...formData, idSantri: e.target.value })}
              placeholder="Masukkan ID santri"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kelas">Kelas</Label>
            <Input
              id="kelas"
              value={formData.kelas}
              onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
              placeholder="Contoh: 1A, 2B, 3C"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.santri}>Santri</SelectItem>
                <SelectItem value={Role.ustadz}>Ustadz</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Pilih peran yang sesuai dengan status Anda
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Menyimpan...
              </>
            ) : (
              'Simpan Profil'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
