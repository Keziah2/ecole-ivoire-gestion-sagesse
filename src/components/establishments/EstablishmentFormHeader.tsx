
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EstablishmentFormHeaderProps {
  isEditing: boolean;
  onCancel: () => void;
}

const EstablishmentFormHeader = ({ isEditing, onCancel }: EstablishmentFormHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={onCancel}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier l\'établissement' : 'Nouvel établissement'}
        </h2>
        <p className="text-gray-600">
          {isEditing ? 'Modifiez les informations de l\'établissement' : 'Créez un nouvel établissement pour le groupe scolaire'}
        </p>
      </div>
    </div>
  );
};

export default EstablishmentFormHeader;
