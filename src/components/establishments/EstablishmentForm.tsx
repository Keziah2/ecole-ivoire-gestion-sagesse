
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EstablishmentFormHeader from "./EstablishmentFormHeader";
import EstablishmentFormFields from "./EstablishmentFormFields";
import EstablishmentFormActions from "./EstablishmentFormActions";

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
    status: 'active' as 'active' | 'inactive' | 'suspended'
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
      <EstablishmentFormHeader 
        isEditing={!!establishment} 
        onCancel={onCancel} 
      />

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'établissement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <EstablishmentFormFields 
              formData={formData}
              onInputChange={handleInputChange}
            />
            
            <EstablishmentFormActions 
              isSubmitting={isSubmitting}
              isEditing={!!establishment}
              onCancel={onCancel}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstablishmentForm;
