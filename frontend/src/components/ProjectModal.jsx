import React, { useState, useEffect } from 'react';
import { createProject, updateProject } from '../firebase/services';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { X, Calendar, User, Globe, Mail } from 'lucide-react';

const ProjectModal = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientName: '',
    clientEmail: '',
    projectUrl: '',
    estimatedDeadline: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        clientName: project.clientName || '',
        clientEmail: project.clientEmail || '',
        projectUrl: project.projectUrl || '',
        estimatedDeadline: project.estimatedDeadline 
          ? new Date(project.estimatedDeadline).toISOString().split('T')[0]
          : ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        createdBy: user.id,
        publicId: project?.publicId || generatePublicId(),
        status: project?.status || 'planning',
        progress: project?.progress || 0
      };

      if (project) {
        await updateProject(project.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await createProject(projectData);
        toast.success('Project created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const generatePublicId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Enter project description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientName" className="form-label">
              Client Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="clientName"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="Enter client name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="clientEmail" className="form-label">
              Client Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                required
                value={formData.clientEmail}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="Enter client email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="projectUrl" className="form-label">
              Project URL *
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                id="projectUrl"
                name="projectUrl"
                required
                value={formData.projectUrl}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="estimatedDeadline" className="form-label">
              Estimated Deadline *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                id="estimatedDeadline"
                name="estimatedDeadline"
                required
                value={formData.estimatedDeadline}
                onChange={handleChange}
                className="form-input pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {project ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                project ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

