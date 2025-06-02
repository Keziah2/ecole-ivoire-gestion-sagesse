
import { Button } from "@/components/ui/button";

interface EstablishmentFormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const EstablishmentFormActions = ({ isSubmitting, isEditing, onCancel }: EstablishmentFormActionsProps) => {
  return (
    <div className="flex gap-3 pt-6 border-t">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sauvegarde...' : (isEditing ? 'Modifier' : 'Créer')}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
};

export default EstablishmentFormActions;
