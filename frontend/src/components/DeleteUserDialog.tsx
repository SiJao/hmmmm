import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useDeleteUser } from '../hooks/useQueries';
import { UserProfile } from '../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: { principal: Principal; profile: UserProfile };
}

export default function DeleteUserDialog({ isOpen, onClose, user }: DeleteUserDialogProps) {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(user.principal);
      toast.success('Pengguna berhasil dihapus!');
      onClose();
    } catch (error: any) {
      toast.error('Gagal menghapus pengguna', {
        description: error.message || 'Silakan coba lagi',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus pengguna <strong>{user.profile.name}</strong>? 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUser.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteUser.isPending ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
