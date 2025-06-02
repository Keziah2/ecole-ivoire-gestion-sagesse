
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, School, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Establishment {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
}

interface EstablishmentsListProps {
  onEdit: (establishment: Establishment) => void;
  onAdd: () => void;
}

const EstablishmentsList = ({ onEdit, onAdd }: EstablishmentsListProps) => {
  const { data: establishments, isLoading, refetch } = useQuery({
    queryKey: ['establishments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Establishment[];
    }
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'établissement "${name}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Établissement supprimé avec succès');
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'établissement');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800"
    };
    
    const labels = {
      active: "Actif",
      inactive: "Inactif",
      suspended: "Suspendu"
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border-0`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Chargement des établissements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Liste des Établissements</h2>
          <p className="text-gray-600">Gérez tous les établissements du groupe scolaire</p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvel Établissement
        </Button>
      </div>

      {!establishments || establishments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <School className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun établissement</h3>
            <p className="text-gray-600 mb-4">Commencez par créer votre premier établissement</p>
            <Button onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un établissement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.map((establishment) => (
            <Card key={establishment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <School className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{establishment.name}</CardTitle>
                      <CardDescription>Code: {establishment.code}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(establishment.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {establishment.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{establishment.address}</span>
                  </div>
                )}
                {establishment.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{establishment.phone}</span>
                  </div>
                )}
                {establishment.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{establishment.email}</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(establishment)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(establishment.id, establishment.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EstablishmentsList;
