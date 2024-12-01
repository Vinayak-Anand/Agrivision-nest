import AddNote from './AddNote';
import NoteCard from './NoteCard';

const NotesContainer = ({
    notes,
    onAdd,
    onEdit,
    onDelete,
}: {
    notes: any[];
    onAdd: (content: string) => void;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
}) => {
    const noteColors = ['bg-amber-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100'];

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
            {/* Render all notes */}
            {notes.map((note, index) => {

                return (
                    <NoteCard
                        key={note.noteId} // Use noteId as the unique key
                        note={note}
                        color={noteColors[index % noteColors.length]}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                );
            })}

            {/* Render Add Note box with a unique key */}
            <AddNote key="add-note" onAdd={onAdd} />
        </div>
    );
};

export default NotesContainer;
