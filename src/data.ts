import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = []

// LocalStorage Persistence Helpers
const PROJECTS_KEY = 'cdm_portfolio_projects';
const MESSAGES_KEY = 'cdm_portfolio_messages';
const ANALYTICS_KEY = 'cdm_portfolio_analytics_events';

export const loadProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (!data) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading projects from localStorage', e);
    return INITIAL_PROJECTS;
  }
};

export const saveProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects to localStorage', e);
  }
};

export const loadMessages = (): any[] => {
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading messages from localStorage', e);
    return [];
  }
};

export const saveMessage = (msg: any) => {
  try {
    const current = loadMessages();
    const updated = [msg, ...current];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving message to localStorage', e);
  }
};

export const deleteMessage = (id: string) => {
  try {
    const current = loadMessages();
    const updated = current.filter(m => m.id !== id);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting message from localStorage', e);
  }
};

export const loadAnalyticsEvents = (): any[] => {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading analytics events from localStorage', e);
    return [];
  }
};

export const saveAnalyticsEvent = (event: any) => {
  try {
    const current = loadAnalyticsEvents();
    const updated = [event, ...current].slice(0, 800); // Limit to last 800 events to conserve localStorage quota
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving analytics event', e);
  }
};
