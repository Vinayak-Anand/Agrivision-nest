import { useEffect, useState } from 'react';
import api from '../../api/axios';
import NotesContainer from './NotesContainer';

const NotesSection = ({ courseId, userId }: { courseId: string; userId: string }) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await api.get(`/user-courses/${userId}/${courseId}/notes`);
                setNotes(response.data);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [courseId, userId]);

  const addNote = async (content: string) => {
      const noteId = `${Date.now()}`; // Generate unique ID
      try {
          const response = await api.post(`/user-courses/${userId}/${courseId}/notes`, {
              noteId: noteId,
              content,
          });
        const newNote = (await api.get(`/user-courses/${userId}/${courseId}/notes/${noteId}`)).data;
          setNotes((prevNotes) => [...prevNotes, newNote]); // Update after response
      } catch (error) {
          console.error('Error adding note:', error);
      }
  };

    const editNote = async (noteId: string, newContent: string) => {
      try {
        await api.put(`/user-courses/${userId}/${courseId}/notes/${noteId}`, {
          content: newContent,
        });
        const updatedNote = (await api.get(`/user-courses/${userId}/${courseId}/notes/${noteId}`)).data;
        setNotes(
          notes.map((note) =>
            note.noteId === noteId ? updatedNote : note
          )
        );
      } catch (error) {
        console.error('Error editing note:', error);
      }
    };

    const deleteNote = async (noteId: string) => {
        try {
            await api.delete(`/user-courses/${userId}/${courseId}/notes/${noteId}`);
            setNotes(notes.filter((note) => note.noteId !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Take Notes</h3>
                <button
                    onClick={() => setHidden(!hidden)}
                    className="text-blue-500 underline text-sm"
                >
                    {hidden ? 'Show Notes' : 'Hide Notes'}
                </button>
            </div>
            {!hidden && (
                <NotesContainer notes={notes} onAdd={addNote} onEdit={editNote} onDelete={deleteNote} />
            )}
        </div>
    );
};

export default NotesSection;
