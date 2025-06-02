
import { useState } from "react";
import Navigation from "@/components/Navigation";
import EducationLevelsList from "@/components/education-levels/EducationLevelsList";
import EducationLevelForm from "@/components/education-levels/EducationLevelForm";

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

const EducationLevels = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | undefined>();

  const handleEdit = (level: EducationLevel) => {
    setSelectedLevel(level);
    setView('form');
  };

  const handleAdd = () => {
    setSelectedLevel(undefined);
    setView('form');
  };

  const handleSuccess = () => {
    setView('list');
    setSelectedLevel(undefined);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedLevel(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {view === 'list' ? (
          <EducationLevelsList onEdit={handleEdit} onAdd={handleAdd} />
        ) : (
          <EducationLevelForm 
            educationLevel={selectedLevel}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default EducationLevels;
