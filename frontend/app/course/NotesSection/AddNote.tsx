import { useState } from 'react';

const AddNote = ({ onAdd }: { onAdd: (content: string) => void }) => {
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (newNote.trim()) {
            onAdd(newNote); // Call parent function to add the note
            setNewNote(''); // Clear the input
        }
    };

    return (
        <div
            className="flex items-center justify-center p-4 bg-gray-100 rounded shadow-md border-dashed border-2 border-gray-300"
            onBlur={() => handleAddNote()} // Save note when clicking outside
        >
            <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()} // Save note on Enter
                placeholder="Type here"
                className="w-full h-full bg-transparent text-sm focus:outline-none"
            />
        </div>
    );
};

export default AddNote;
