import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useEditUser } from '../hooks/useQueries';
import { Role, UserProfile } from '../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { principal: Principal; profile: UserProfile };
}

export default function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.profile.name,
    idSantri: user.profile.idSantri,
    kelas: user.profile.kelas || '',
    role: user.profile.role,
  });

  const editUser = useEditUser();

  useEffect(() => {
    setFormData({
      name: user.profile.name,
      idSantri: user.profile.idSantri,
      kelas: user.profile.kelas || '',
      role: user.profile.role,
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.idSantri) {
      toast.error('Mohon lengkapi data yang diperlukan');
      return;
    }

    try {
      await editUser.mutateAsync({
        principal: user.principal,
        profile: {
          name: formData.name,
          idSantri: formData.idSantri,
          kelas: formData.kelas || undefined,
          role: formData.role,
        },
      });
      toast.success('Pengguna berhasil diperbarui!');
      onClose();
    } catch (error: any) {
      toast.error('Gagal memperbarui pengguna', {
        description: error.message || 'Silakan coba lagi',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui informasi pengguna
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
            <Label htmlFor="role">Peran *</Label>
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
                <SelectItem value={Role.admin}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={editUser.isPending}
            >
              {editUser.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
