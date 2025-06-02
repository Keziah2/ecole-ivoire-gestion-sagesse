
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface EducationLevel {
  id: string;
  level_name: string;
  level_code: string;
  cycle: 'prescolaire' | 'primaire' | 'secondaire';
  order_index: number;
  is_active: boolean;
  establishment_id: string;
  created_at: string;
  establishments?: {
    name: string;
  };
}

interface EducationLevelsListProps {
  onEdit: (level: EducationLevel) => void;
  onAdd: () => void;
}

const EducationLevelsList = ({ onEdit, onAdd }: EducationLevelsListProps) => {
  const [levels, setLevels] = useState<EducationLevel[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<EducationLevel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cycleFilter, setCycleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLevels = async () => {
    try {
      const { data, error } = await supabase
        .from('education_levels')
        .select(`
          *,
          establishments (
            name
          )
        `)
        .order('establishment_id')
        .order('order_index');

      if (error) throw error;
      setLevels(data || []);
      setFilteredLevels(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des niveaux:', error);
      toast.error('Erreur lors du chargement des niveaux d\'éducation');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    let filtered = levels;

    if (searchTerm) {
      filtered = filtered.filter(level =>
        level.level_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        level.level_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        level.establishments?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cycleFilter !== "all") {
      filtered = filtered.filter(level => level.cycle === cycleFilter);
    }

    setFilteredLevels(filtered);
  }, [searchTerm, cycleFilter, levels]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce niveau d\'éducation ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('education_levels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Niveau d\'éducation supprimé avec succès');
      fetchLevels();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du niveau d\'éducation');
    }
  };

  const getCycleBadgeColor = (cycle: string) => {
    switch (cycle) {
      case 'prescolaire': return 'bg-green-100 text-green-800';
      case 'primaire': return 'bg-blue-100 text-blue-800';
      case 'secondaire': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'prescolaire': return 'Préscolaire';
      case 'primaire': return 'Primaire';
      case 'secondaire': return 'Secondaire';
      default: return cycle;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des niveaux d'éducation...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Niveaux d'Éducation</h1>
          <p className="text-gray-600 mt-1">Gérez les classes et niveaux par établissement</p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un niveau
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, code ou établissement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={cycleFilter} onValueChange={setCycleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les cycles</SelectItem>
                <SelectItem value="prescolaire">Préscolaire</SelectItem>
                <SelectItem value="primaire">Primaire</SelectItem>
                <SelectItem value="secondaire">Secondaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Niveaux d'Éducation ({filteredLevels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLevels.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun niveau d'éducation trouvé.</p>
              <Button onClick={onAdd} className="mt-4">
                Créer le premier niveau
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du niveau</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLevels.map((level) => (
                    <TableRow key={level.id}>
                      <TableCell className="font-medium">{level.level_name}</TableCell>
                      <TableCell>{level.level_code}</TableCell>
                      <TableCell>
                        <Badge className={getCycleBadgeColor(level.cycle)}>
                          {getCycleLabel(level.cycle)}
                        </Badge>
                      </TableCell>
                      <TableCell>{level.establishments?.name || 'N/A'}</TableCell>
                      <TableCell>{level.order_index}</TableCell>
                      <TableCell>
                        <Badge variant={level.is_active ? "default" : "secondary"}>
                          {level.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(level)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(level.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationLevelsList;
