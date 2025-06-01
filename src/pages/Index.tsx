
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  MessageSquare, 
  BarChart3,
  Shield,
  School,
  CreditCard,
  UserCheck
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  const modules = [
    {
      title: "Gestion des Utilisateurs",
      description: "Contrôle d'accès basé sur les rôles (RBAC)",
      icon: <Users className="w-6 h-6" />,
      status: "En développement",
      color: "bg-blue-500"
    },
    {
      title: "Gestion des Établissements",
      description: "Administration des écoles du groupe",
      icon: <School className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-green-500"
    },
    {
      title: "Gestion Pédagogique",
      description: "Élèves, classes, assiduité et évaluations",
      icon: <GraduationCap className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-purple-500"
    },
    {
      title: "Gestion du Personnel",
      description: "Enseignants et personnel administratif",
      icon: <UserCheck className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-orange-500"
    },
    {
      title: "Gestion Financière",
      description: "Trésorerie et paiements digitaux CI",
      icon: <DollarSign className="w-6 h-6" />,
      status: "Critique",
      color: "bg-red-500"
    },
    {
      title: "Portail Parents",
      description: "Accès sécurisé pour les parents",
      icon: <BookOpen className="w-6 h-6" />,
      status: "Critique",
      color: "bg-indigo-500"
    },
    {
      title: "Communication",
      description: "Messagerie et notifications",
      icon: <MessageSquare className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-cyan-500"
    },
    {
      title: "Rapports & Statistiques",
      description: "Tableaux de bord et analyses",
      icon: <BarChart3 className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-amber-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "En développement": "bg-blue-100 text-blue-800",
      "Critique": "bg-red-100 text-red-800",
      "Planifié": "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={`${variants[status]} border-0`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Modernisez la gestion de vos écoles
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plateforme numérique complète pour centraliser et automatiser la gestion administrative, 
            pédagogique et financière de votre groupe scolaire en Côte d'Ivoire.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Paiements Mobile Money
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Sécurité renforcée
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Multi-établissements
            </span>
          </div>
          
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Accéder au tableau de bord
              </Button>
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Se connecter
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Créer un compte
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Modules Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Modules du Système
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${module.color} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {module.icon}
                      </div>
                    </div>
                    {getStatusBadge(module.status)}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Sécurité Renforcée</h4>
              <p className="text-gray-600">
                Contrôle d'accès basé sur les rôles (RBAC) avec protection des données sensibles
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Paiements Digitaux CI</h4>
              <p className="text-gray-600">
                Intégration Mobile Money (Orange, MTN, Moov, Wave) et cartes bancaires
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Analyse Avancée</h4>
              <p className="text-gray-600">
                Tableaux de bord et rapports consolidés pour une vision globale
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">SIGES</span>
          </div>
          <p className="text-gray-400">
            Système Intégré de Gestion Scolaire - Côte d'Ivoire
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Développé pour moderniser la gestion des groupes scolaires
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
