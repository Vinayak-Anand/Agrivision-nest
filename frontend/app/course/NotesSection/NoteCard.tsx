import { Menu } from "@headlessui/react";

const NoteCard = ({
  note,
  color,
  onEdit,
  onDelete,
}: {
  note: { noteId: string; content: string };
  color: string;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div
      className={`relative p-4 rounded ${color} shadow-md flex items-center`}
    >
      <p className="text-sm break-words">{note.content}</p>
      <Menu as="div" className="absolute top-2 right-2">
        <Menu.Button>
          <span className="text-gray-500">...</span>
        </Menu.Button>
        <Menu.Items className="absolute z-10 bg-white border rounded shadow-lg left-full ml-2 top-0">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => {
                  const newContent = prompt("Edit Note:", note.content);
                  if (newContent) onEdit(note.noteId, newContent);
                }}
                className={`block px-4 py-2 text-sm ${
                  active ? "bg-gray-100" : ""
                }`}
              >
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onDelete(note.noteId)}
                className={`block px-4 py-2 text-sm text-red-500 ${
                  active ? "bg-gray-100" : ""
                }`}
              >
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default NoteCard;
