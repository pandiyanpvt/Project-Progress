import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  subscribeToTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  getProjectById 
} from '../firebase/services';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User
} from 'lucide-react';
import TaskModal from '../components/TaskModal';

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    fetchProject();
  }, [id, user]);

  useEffect(() => {
    if (!project) return;

    // Subscribe to real-time task updates
    const unsubscribe = subscribeToTasks(project.id, (tasks) => {
      setTasks(tasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [project]);

  const fetchProject = async () => {
    try {
      const projectData = await getProjectById(id);
      if (!projectData) {
        toast.error('Project not found');
        return;
      }
      setProject(projectData);
    } catch (error) {
      toast.error('Failed to fetch project');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'blocked': return 'status-blocked';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <TrendingUp className="h-4 w-4" />;
      case 'blocked': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/admin"
                className="btn btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div>
                <p className="text-sm text-gray-400 mb-1">Client: {project.clientName}</p>
                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Progress</div>
                <div className="text-lg font-semibold text-white">{calculateProgress()}%</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${calculateProgress()}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-12 pb-8">
        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6 text-white">Project Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Deadline:</span>
                <span className="text-sm font-medium text-white">
                  {new Date(project.estimatedDeadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Client:</span>
                <span className="text-sm font-medium text-white">{project.clientName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Status:</span>
                <span className={`status-badge ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-6 text-white">Progress Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Completed Tasks:</span>
                <span className="text-sm font-medium text-white">
                  {tasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Total Tasks:</span>
                <span className="text-sm font-medium text-white">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">In Progress:</span>
                <span className="text-sm font-medium text-white">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-6 text-white">Client Access</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-xs text-gray-400 mb-2">Client View URL:</p>
                <div className="w-full p-3 bg-slate-800 text-white text-sm rounded border border-slate-600">
                  {`${window.location.origin}/project/${project.publicId}`}
                </div>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-xs text-gray-400 mb-2">Project URL:</p>
                <div className="w-full p-3 bg-slate-800 text-white text-sm rounded border border-slate-600">
                  {project.projectUrl}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-white">Tasks</h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Clock className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No tasks yet</h3>
              <p className="text-gray-400 mb-6">Add your first task to get started</p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="btn btn-primary"
              >
                Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {tasks.map((task) => (
                <div key={task._id} className="border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors bg-slate-800/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-2">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1 capitalize">{task.status}</span>
                      </span>
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      {task.dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {(task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate)).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {task.estimatedHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{task.estimatedHours}h estimated</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setShowTaskModal(true);
                        }}
                        className="btn btn-secondary p-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="btn btn-danger p-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projectId={id}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSuccess={() => {
            setShowTaskModal(false);
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

export default ProjectView;

