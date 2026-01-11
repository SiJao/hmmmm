import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useAddUser } from '../hooks/useQueries';
import { Role } from '../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    principal: '',
    name: '',
    idSantri: '',
    kelas: '',
    role: Role.santri,
  });

  const addUser = useAddUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.principal || !formData.name || !formData.idSantri) {
      toast.error('Mohon lengkapi data yang diperlukan');
      return;
    }

    try {
      const principal = Principal.fromText(formData.principal);
      await addUser.mutateAsync({
        principal,
        profile: {
          name: formData.name,
          idSantri: formData.idSantri,
          kelas: formData.kelas || undefined,
          role: formData.role,
        },
      });
      toast.success('Pengguna berhasil ditambahkan!');
      setFormData({
        principal: '',
        name: '',
        idSantri: '',
        kelas: '',
        role: Role.santri,
      });
      onClose();
    } catch (error: any) {
      toast.error('Gagal menambahkan pengguna', {
        description: error.message || 'Silakan coba lagi',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Isi informasi pengguna yang akan ditambahkan
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal ID *</Label>
            <Input
              id="principal"
              value={formData.principal}
              onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
              placeholder="Masukkan Principal ID"
              required
            />
            <p className="text-xs text-muted-foreground">
              Principal ID dari Internet Identity pengguna
            </p>
          </div>

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
              disabled={addUser.isPending}
            >
              {addUser.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                'Tambah Pengguna'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
