
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface Establishment {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface EstablishmentFormProps {
  establishment?: Establishment;
  onSuccess: () => void;
  onCancel: () => void;
}

const EstablishmentForm = ({ establishment, onSuccess, onCancel }: EstablishmentFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    status: 'active' as const
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (establishment) {
      setFormData({
        name: establishment.name,
        code: establishment.code,
        address: establishment.address || '',
        phone: establishment.phone || '',
        email: establishment.email || '',
        status: establishment.status
      });
    }
  }, [establishment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (establishment) {
        // Update existing establishment
        const { error } = await supabase
          .from('establishments')
          .update({
            name: formData.name,
            code: formData.code,
            address: formData.address || null,
            phone: formData.phone || null,
            email: formData.email || null,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', establishment.id);

        if (error) throw error;
        toast.success('Établissement modifié avec succès');
      } else {
        // Create new establishment
        const { error } = await supabase
          .from('establishments')
          .insert({
            name: formData.name,
            code: formData.code,
            address: formData.address || null,
            phone: formData.phone || null,
            email: formData.email || null,
            status: formData.status
          });

        if (error) throw error;
        toast.success('Établissement créé avec succès');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.code === '23505') {
        toast.error('Ce code d\'établissement existe déjà');
      } else {
        toast.error('Erreur lors de la sauvegarde de l\'établissement');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {establishment ? 'Modifier l\'établissement' : 'Nouvel établissement'}
          </h2>
          <p className="text-gray-600">
            {establishment ? 'Modifiez les informations de l\'établissement' : 'Créez un nouvel établissement pour le groupe scolaire'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'établissement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'établissement *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: École Primaire Sainte-Marie"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code de l'établissement *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Ex: EPSM001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ex: +225 27 22 XX XX XX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Ex: contact@ecole.ci"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Ex: Cocody, Riviera 3, Rue des Jardins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sauvegarde...' : (establishment ? 'Modifier' : 'Créer')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstablishmentForm;
