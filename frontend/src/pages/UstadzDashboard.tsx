import { useState } from 'react';
import { UserProfile } from '../backend';
import DashboardLayout from '../components/DashboardLayout';
import { useGetAllSantri } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Users, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';

interface UstadzDashboardProps {
  profile: UserProfile;
}

export default function UstadzDashboard({ profile }: UstadzDashboardProps) {
  const { data: santriList, isLoading } = useGetAllSantri();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSantri = santriList?.filter(([_, santri]) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      santri.name.toLowerCase().includes(searchLower) ||
      santri.idSantri.toLowerCase().includes(searchLower) ||
      (santri.kelas && santri.kelas.toLowerCase().includes(searchLower))
    );
  });

  return (
    <DashboardLayout profile={profile} title="Dashboard Ustadz">
      <Card className="shadow-lg border-emerald-100">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Daftar Santri</CardTitle>
                <CardDescription>Data santri yang terdaftar</CardDescription>
              </div>
            </div>
            {santriList && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {santriList.length} Santri
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Input
              placeholder="Cari berdasarkan nama, ID, atau kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredSantri && filteredSantri.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>ID Santri</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.map(([principal, santri]) => (
                    <TableRow key={principal.toString()}>
                      <TableCell className="font-medium">{santri.name}</TableCell>
                      <TableCell>{santri.idSantri}</TableCell>
                      <TableCell>{santri.kelas || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Aktif
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 'Tidak ada santri yang sesuai dengan pencarian' : 'Belum ada data santri'}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
