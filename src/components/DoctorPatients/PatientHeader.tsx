import { SearchHeader } from "@/components/Search-header";

type PatientHeaderProps = {
  searchTerm: string;
  handleSearch: React.ChangeEventHandler<HTMLInputElement>;
};

export function PatientHeader({
  searchTerm,
  handleSearch,
}: PatientHeaderProps) {
  // Convertir le gestionnaire d'événements pour correspondre au format attendu par SearchHeader
  const handleSearchChange = (value: string) => {
    // Créer un événement synthétique à passer à handleSearch
    const event = {
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>;

    handleSearch(event);
  };

  return (
    <SearchHeader
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      label="Rechercher des patients"
      placeholder="Rechercher par nom, email ou numéro de téléphone..."
      id="patient-search"
    />
  );
}
