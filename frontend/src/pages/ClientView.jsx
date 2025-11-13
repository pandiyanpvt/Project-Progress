import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getProjectByPublicId,
  subscribeToTasks 
} from '../firebase/services';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Globe,
  User,
  Mail
} from 'lucide-react';

const ClientView = () => {
  const { publicId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [publicId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectByPublicId(publicId);
      
      if (!projectData) {
        setError('Project not found');
        return;
      }
      
      setProject(projectData);
      
      // Subscribe to real-time task updates
      const unsubscribe = subscribeToTasks(projectData.id, (tasks) => {
        setTasks(tasks);
        setLoading(false);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600/40 border-green-500';
      case 'in-progress': return 'bg-blue-600/40 border-blue-500';
      case 'pending': return 'bg-yellow-600/40 border-yellow-500';
      case 'blocked': return 'bg-red-600/40 border-red-500';
      default: return 'bg-gray-600/40 border-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'blocked': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getDaysUntilDeadline = () => {
    if (!project?.estimatedDeadline) return null;
    const deadline = project.estimatedDeadline.toDate ? project.estimatedDeadline.toDate() : new Date(project.estimatedDeadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
          <p className="text-gray-300">The project you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const daysUntilDeadline = getDaysUntilDeadline();

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-gray-300 mt-2">{project.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Globe className="h-4 w-4" />
                <span>Live Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-900">
        <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Overview */}
          <div className="lg:col-span-1">
            <div className="card mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Overall Progress</h2>
              
              {/* Progress Bar */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                  <span className="text-sm font-bold text-blue-400">{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Estimated Deadline */}
              {project.estimatedDeadline && (
                <div className="flex items-center gap-4 mt-8">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Estimated Date</p>
                    <p className="font-medium text-white">
                      {(project.estimatedDeadline.toDate ? project.estimatedDeadline.toDate() : new Date(project.estimatedDeadline)).toLocaleDateString('en-GB')}
                    </p>
                    {daysUntilDeadline !== null && (
                      <p className={`text-sm ${
                        daysUntilDeadline < 0 ? 'text-red-400' : 
                        daysUntilDeadline <= 7 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {daysUntilDeadline < 0 ? `${Math.abs(daysUntilDeadline)} days overdue` :
                         daysUntilDeadline === 0 ? 'Due today' :
                         `${daysUntilDeadline} days remaining`}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="pb-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">Real-time updates on project tasks</h2>
              </div>
              
              <div className="pt-6">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No tasks have been added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {tasks.map((task) => {
                      const getStatusStyle = (status) => {
                        switch (status) {
                          case 'completed': return { backgroundColor: 'rgba(34, 197, 94, 0.3)', borderColor: 'rgb(34, 197, 94)' };
                          case 'in-progress': return { backgroundColor: 'rgba(59, 130, 246, 0.3)', borderColor: 'rgb(59, 130, 246)' };
                          case 'pending': return { backgroundColor: 'rgba(234, 179, 8, 0.3)', borderColor: 'rgb(234, 179, 8)' };
                          case 'blocked': return { backgroundColor: 'rgba(239, 68, 68, 0.3)', borderColor: 'rgb(239, 68, 68)' };
                          default: return { backgroundColor: 'rgba(107, 114, 128, 0.3)', borderColor: 'rgb(107, 114, 128)' };
                        }
                      };
                      
                      return (
                      <div 
                        key={task.id} 
                        className="border rounded-lg p-6 hover:opacity-80 transition-all"
                        style={getStatusStyle(task.status)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getStatusIcon(task.status)}
                              <h3 className="font-medium text-white text-lg">{task.title}</h3>
                            </div>
                            {task.description && (
                              <p className="text-sm text-gray-300 mb-4">{task.description}</p>
                            )}
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                              {task.dueDate && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    Due {(task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate)).toLocaleDateString('en-GB')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className={`capitalize font-medium ${
                              task.status === 'completed' ? 'text-green-400' :
                              task.status === 'in-progress' ? 'text-blue-400' :
                              task.status === 'pending' ? 'text-yellow-400' :
                              task.status === 'blocked' ? 'text-red-400' :
                              'text-gray-400'
                            }`}>{task.status}</span>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;