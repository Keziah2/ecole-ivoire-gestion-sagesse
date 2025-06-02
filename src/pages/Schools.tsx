
import { useState } from "react";
import Navigation from "@/components/Navigation";
import EstablishmentsList from "@/components/establishments/EstablishmentsList";
import EstablishmentForm from "@/components/establishments/EstablishmentForm";

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

const Schools = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | undefined>();

  const handleEdit = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setView('form');
  };

  const handleAdd = () => {
    setSelectedEstablishment(undefined);
    setView('form');
  };

  const handleSuccess = () => {
    setView('list');
    setSelectedEstablishment(undefined);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedEstablishment(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {view === 'list' ? (
          <EstablishmentsList onEdit={handleEdit} onAdd={handleAdd} />
        ) : (
          <EstablishmentForm 
            establishment={selectedEstablishment}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default Schools;
