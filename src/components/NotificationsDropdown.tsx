import Dropdown from "./ui/BaseDropdown";

const NotificationsDropdown = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Dropdown isOpen={isOpen} onClose={onClose} width="w-64">
    <div className="p-3 border-b border-light-border dark:border-dark-border">
      <h3 className="font-medium">Notifications</h3>
    </div>
    <div className="max-h-60 overflow-y-auto">
      {/* Notification items would go here */}
      <div className="p-3 hover:bg-light-card dark:hover:bg-dark-card">
        New game invitation
      </div>
    </div>
  </Dropdown>
);

export default NotificationsDropdown;
