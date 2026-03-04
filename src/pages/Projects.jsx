import React, { useState, useEffect } from 'react'
import ProjectModal from '../components/ProjectModal'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'

export default function Projects() {

  const [projects, setProjects] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        // Group by status
        const grouped = {
          todo: [],
          inProgress: [],
          completed: [],
        }

        data?.forEach(p => {
          let statusKey = p.status || 'todo'
          if (statusKey === 'in-progress') statusKey = 'inProgress'
          if (grouped[statusKey]) {
            grouped[statusKey].push(p)
          }
        })

        setProjects(grouped)
      } catch (err) {
        console.error('Fetch projects error:', err)
        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const openModal = (project = null) => {
    console.log('Opening modal for project:', project)
    setEditingProject(project)
    setModalOpen(true)
  }

  const handleSave = async (formData) => {
    try {
      let savedProject

      if (editingProject?.id) {
        // UPDATE
        const { data, error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            status: formData.status,
          })
          .eq('id', editingProject.id)
          .select()
          .single()

        if (error) throw error
        savedProject = data
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('projects')
          .insert({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            status: formData.status,
          })
          .select()
          .single()

        if (error) throw error
        savedProject = data
      }

      // Update local state
      setProjects(prev => {
        const column = savedProject.status === 'in-progress' ? 'inProgress' : savedProject.status
        let newState = { ...prev }

        // Remove from old column if status changed
        Object.keys(prev).forEach(k => {
          if (k !== column) {
            newState[k] = newState[k].filter(p => p.id !== savedProject.id)
          }
        })

        // Add / update
        if (editingProject) {
          newState[column] = newState[column].map(p =>
            p.id === savedProject.id ? savedProject : p
          )
        } else {
          newState[column] = [...(newState[column] || []), savedProject]
        }

        return newState
      })

      setModalOpen(false)
      setEditingProject(null)
    } catch (err) {
      console.error('Save project error:', err)
      alert(err.message || 'Failed to save project. Check console.')
    }
  }

  const handleDone = async (projectId) => {
  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)

    if (error) throw error

    // Remove from UI
    setProjects(prev => {
      const newState = { ...prev }

      Object.keys(newState).forEach(key => {
        newState[key] = newState[key].filter(p => p.id !== projectId)
      })

      return newState
    })

    setModalOpen(false)
    setEditingProject(null)

  } catch (err) {
    console.error("Delete error:", err)
    alert("Failed to delete project")
  }
}

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-900/50 text-red-300 border-red-700'
      case 'medium': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700'
      case 'low': return 'bg-blue-900/50 text-blue-300 border-blue-700'
      default: return 'bg-gray-800 text-gray-300 border-gray-700'
    }
  }

  const renderColumn = (title, items, bgColor = 'bg-gray-900') => (
    <div className={`flex-1 ${bgColor} rounded-xl border border-gray-800 p-6 shadow-sm min-h-[500px]`}>
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-between">
        {title}
        <span className="text-sm font-normal text-gray-400">({items.length})</span>
      </h2>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading projects...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No projects here yet</p>
          <p className="mt-2 text-sm">Add one to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(project => (
            <div
              key={project.id}
              onClick={() => openModal(project)}
              className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-indigo-700 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => openModal({ status: title.toLowerCase().replace(' ', '-') })}
        className="mt-6 w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Project
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <h1 className="text-3xl font-bold text-white">Projects</h1>
              <p className="mt-2 text-gray-400">
                Track your current, upcoming, and completed projects
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white font-medium rounded-lg shadow-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-center py-4">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {renderColumn("To Do", projects.todo)}
            {renderColumn("In Progress", projects.inProgress, 'bg-gray-950')}
            {renderColumn("Completed", projects.completed, 'bg-gray-950')}
          </div>
        </div>
      </main>

      {modalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setModalOpen(false)
            setEditingProject(null)
          }}
          onDone={handleDone}
          onSave={handleSave}
        />
      )}

      <footer className="mt-auto bg-gray-950 border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        Bug Tracker • Made with ♥ by Hebron © {new Date().getFullYear()}
      </footer>
    </div>
  )
}