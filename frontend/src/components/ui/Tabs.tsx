interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? "text-gray-600 border-b-2 border-gray-600" : "text-gray-500 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

export function TabNavigation({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <div className="flex gap-1 justify-center">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
}
