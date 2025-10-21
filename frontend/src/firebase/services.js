import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './config';

// Projects Collection
export const projectsCollection = collection(db, 'projects');
export const tasksCollection = collection(db, 'tasks');

// Project CRUD operations
export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(projectsCollection, {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getProjects = async (userId) => {
  try {
    const q = query(projectsCollection, where('createdBy', '==', userId));
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in JavaScript instead of Firestore
    return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId));
    if (!projectDoc.exists()) {
      return null;
    }
    return { id: projectDoc.id, ...projectDoc.data() };
  } catch (error) {
    console.error('Error getting project by ID:', error);
    throw error;
  }
};

export const getProjectByPublicId = async (publicId) => {
  try {
    const q = query(projectsCollection, where('publicId', '==', publicId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting project by public ID:', error);
    throw error;
  }
};

export const updateProject = async (projectId, updateData) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { id: projectId, ...updateData };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    // Also delete all tasks for this project
    const tasksQuery = query(tasksCollection, where('projectId', '==', projectId));
    const tasksSnapshot = await getDocs(tasksQuery);
    const deletePromises = tasksSnapshot.docs.map(taskDoc => deleteDoc(taskDoc.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Task CRUD operations
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(tasksCollection, {
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...taskData };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const getTasks = async (projectId) => {
  try {
    const q = query(tasksCollection, where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in JavaScript instead of Firestore
    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updateData) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { id: taskId, ...updateData };
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToProjects = (userId, callback) => {
  const q = query(projectsCollection, where('createdBy', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in JavaScript instead of Firestore
    const sortedProjects = projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(sortedProjects);
  });
};

export const subscribeToTasks = (projectId, callback) => {
  const q = query(tasksCollection, where('projectId', '==', projectId));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in JavaScript instead of Firestore
    const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(sortedTasks);
  });
};
