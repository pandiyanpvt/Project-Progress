import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  subscribeToProjects, 
  deleteProject,
  subscribeToTasks
} from '../firebase/services';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Globe, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import ProjectModal from '../components/ProjectModal';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectProgressMap, setProjectProgressMap] = useState({});
  
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToProjects(user.id, (projects) => {
      setProjects(projects);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Subscribe to task changes for each project to compute live progress
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const unsubscribers = projects.map((project) =>
      subscribeToTasks(project.id, (tasks) => {
        const completed = tasks.filter((t) => t.status === 'completed').length;
        const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
        setProjectProgressMap((prev) => ({ ...prev, [project.id]: pct }));
      })
    );

    return () => {
      unsubscribers.forEach((u) => {
        try { u && u(); } catch (_) {}
      });
    };
  }, [projects]);

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(projectId);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'testing': return 'text-yellow-600';
      case 'on-hold': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <TrendingUp className="h-4 w-4" />;
      case 'testing': return <AlertCircle className="h-4 w-4" />;
      case 'on-hold': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Manage your projects and track progress</p>
              <h1 className="text-3xl font-bold text-white">Your Projects</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div></div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Globe className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Create your first project to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="card">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400 capitalize">{project.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Progress</span>
                    <span className="text-sm text-gray-400">{projectProgressMap[project.id] ?? project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${projectProgressMap[project.id] ?? project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.estimatedDeadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <Link
                    to={`/admin/project/${project.id}`}
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowModal(true);
                    }}
                    className="btn btn-secondary p-3"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="btn btn-danger p-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <p className="text-xs text-gray-400 mb-2">Client View URL:</p>
                  <code className="text-xs text-gray-300 break-all bg-slate-900 p-2 rounded block">
                    {window.location.origin}/project/{project.publicId}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Project Modal */}
      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

