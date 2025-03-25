import { SearchHeader } from "@/components/Search-header";

type PatientHeaderProps = {
  searchTerm: string;
  handleSearch: React.ChangeEventHandler<HTMLInputElement>;
};

export function PatientHeader({
  searchTerm,
  handleSearch,
}: PatientHeaderProps) {
  // Convert the event handler to match SearchHeader's expected format
  const handleSearchChange = (value: string) => {
    // Create a synthetic event to pass to handleSearch
    const event = {
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>;

    handleSearch(event);
  };

  return (
    <SearchHeader
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      label="Search Patients"
      placeholder="Search by name, email, or phone number..."
      id="patient-search"
    />
  );
}
