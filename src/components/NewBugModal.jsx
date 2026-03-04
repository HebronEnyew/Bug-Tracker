import React from 'react'
import { useState } from 'react';
import { supabase } from '../lib/supabase' 

const NewBugModal = ({ onClose, onBugCreated }) => {

    const [form, setForm] = useState({
        title: '',
        description: '',
        severity:'medium',
        status: 'open'
    })

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    const { data, error } = await supabase
      .from('bugs')
      .insert([form])
      .select();  

    if (error) throw error;

    onBugCreated(data[0]);  
  } catch (err) {
    console.error(err);
    alert(err.message || 'Failed to create bug');
  } finally {
    setSubmitting(false);
  }
};
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create New Bug</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 text-black dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 text-black dark:border-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-black dark:text-gray-300">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Severity</label>
              <select
                value={form.severity}
                onChange={e => setForm({ ...form, severity: e.target.value })}
                className="w-full p-2.5 border rounded-lg dark:bg-gray-700 text-black dark:border-gray-600"
              >
                <option value="critical ">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Initial Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-indigo-950 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Bug'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBugModal