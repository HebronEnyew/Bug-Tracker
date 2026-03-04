import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const BugDetailsModal = ({ bug, onClose, onUpdate, onDelete }) => {
    const [notes, setNotes] = useState(bug?.notes || '');
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ ...bug });

    const handleSave = async () => {
        try {
            const { data, error } = await supabase
                .from('bugs')
                .update({ ...form, notes })
                .eq('id', bug.id)
                .select()
                .single();

            if (error) throw error;

            onUpdate(data);      
            setIsEditing(false);
        } catch (err) {
            console.error('Update error:', err);
            alert(err.message || 'Failed to save changes');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this bug?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('bugs')
                .delete()
                .eq('id', bug.id);

            if (error) throw error;

            onDelete(bug.id);
            onClose();
        } catch (err) {
            console.error('Delete error:', err);
            alert(err.message || 'Failed to delete bug');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-black dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="p-6 border-b text-black dark:border-gray-700 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {isEditing ? (
                                <input
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-gray-800"
                                />
                            ) : form.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Severity: <span className="font-medium">{form.severity.toUpperCase()}</span> •
                            Status: <span className="font-medium">{form.status}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-3xl text-gray-500 hover:text-gray-800">×</button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        {isEditing ? (
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                rows={6}
                                className="w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700"
                            />
                        ) : (
                            <p className="whitespace-pre-wrap">{form.description || 'No description'}</p>
                        )}
                    </div>

                    {/* Notes Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Notes / Comments</h3>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={5}
                            placeholder="Add updates, thoughts, steps to reproduce..."
                            className="w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t dark:border-gray-700 flex justify-between">
                    <div>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 mr-3"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
                    >
                        Delete Bug
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BugDetailsModal