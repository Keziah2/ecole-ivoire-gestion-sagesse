
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface EducationLevel {
  id: string;
  level_name: string;
  level_code: string;
  cycle: 'prescolaire' | 'primaire' | 'secondaire';
  order_index: number;
  is_active: boolean;
  establishment_id: string;
  created_at: string;
}

interface Establishment {
  id: string;
  name: string;
}

interface EducationLevelFormProps {
  educationLevel?: EducationLevel;
  onSuccess: () => void;
  onCancel: () => void;
}

const EducationLevelForm = ({ educationLevel, onSuccess, onCancel }: EducationLevelFormProps) => {
  const [formData, setFormData] = useState({
    level_name: '',
    level_code: '',
    cycle: 'primaire' as 'prescolaire' | 'primaire' | 'secondaire',
    order_index: 1,
    is_active: true,
    establishment_id: ''
  });
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEstablishments();
    if (educationLevel) {
      setFormData({
        level_name: educationLevel.level_name,
        level_code: educationLevel.level_code,
        cycle: educationLevel.cycle,
        order_index: educationLevel.order_index,
        is_active: educationLevel.is_active,
        establishment_id: educationLevel.establishment_id
      });
    }
  }, [educationLevel]);

  const fetchEstablishments = async () => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setEstablishments(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des établissements:', error);
      toast.error('Erreur lors du chargement des établissements');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.level_name || !formData.level_code || !formData.establishment_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      if (educationLevel) {
        // Update existing level
        const { error } = await supabase
          .from('education_levels')
          .update({
            level_name: formData.level_name,
            level_code: formData.level_code,
            cycle: formData.cycle,
            order_index: formData.order_index,
            is_active: formData.is_active,
            establishment_id: formData.establishment_id
          })
          .eq('id', educationLevel.id);

        if (error) throw error;
        toast.success('Niveau d\'éducation modifié avec succès');
      } else {
        // Create new level
        const { error } = await supabase
          .from('education_levels')
          .insert({
            level_name: formData.level_name,
            level_code: formData.level_code,
            cycle: formData.cycle,
            order_index: formData.order_index,
            is_active: formData.is_active,
            establishment_id: formData.establishment_id
          });

        if (error) throw error;
        toast.success('Niveau d\'éducation créé avec succès');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.code === '23505') {
        toast.error('Ce code de niveau existe déjà pour cet établissement');
      } else {
        toast.error('Erreur lors de la sauvegarde du niveau d\'éducation');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {educationLevel ? 'Modifier le niveau' : 'Nouveau niveau d\'éducation'}
          </h1>
          <p className="text-gray-600 mt-1">
            {educationLevel ? 'Modifiez les informations du niveau d\'éducation' : 'Créez un nouveau niveau d\'éducation'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du niveau</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="level_name">Nom du niveau *</Label>
                <Input
                  id="level_name"
                  value={formData.level_name}
                  onChange={(e) => handleInputChange('level_name', e.target.value)}
                  placeholder="Ex: CP, CE1, 6ème..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level_code">Code du niveau *</Label>
                <Input
                  id="level_code"
                  value={formData.level_code}
                  onChange={(e) => handleInputChange('level_code', e.target.value)}
                  placeholder="Ex: CP, CE1, 6EME..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="establishment_id">Établissement *</Label>
                <Select
                  value={formData.establishment_id}
                  onValueChange={(value) => handleInputChange('establishment_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un établissement" />
                  </SelectTrigger>
                  <SelectContent>
                    {establishments.map((establishment) => (
                      <SelectItem key={establishment.id} value={establishment.id}>
                        {establishment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle">Cycle d'éducation *</Label>
                <Select
                  value={formData.cycle}
                  onValueChange={(value: 'prescolaire' | 'primaire' | 'secondaire') => handleInputChange('cycle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescolaire">Préscolaire</SelectItem>
                    <SelectItem value="primaire">Primaire</SelectItem>
                    <SelectItem value="secondaire">Secondaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Ordre d'affichage</Label>
                <Input
                  id="order_index"
                  type="number"
                  min="1"
                  value={formData.order_index}
                  onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Statut</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active" className="text-sm text-gray-600">
                    {formData.is_active ? 'Actif' : 'Inactif'}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (educationLevel ? 'Modification...' : 'Création...') 
                  : (educationLevel ? 'Modifier' : 'Créer')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationLevelForm;
