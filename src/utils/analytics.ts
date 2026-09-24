import { quizData } from '../data/quizData';

export interface SessionLog {
  id: string;
  startedAt: string;
  maxStep: number;
  completed: boolean;
  answers: Record<number, string>;
}

export interface AnalyticsData {
  totalVisits: number;
  stepViews: Record<number, number>; // stepId -> how many times it was reached
  dropOffs: Record<number, number>;  // stepId -> how many sessions ended at this step
  completions: number;
  sessions: SessionLog[];
}

const STORAGE_KEY = 'calistenia_quiz_analytics_v1';
const ADMIN_PASSWORD_KEY = 'calistenia_admin_password';

export function getAdminPassword(): string {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || 'admin21';
}

export function setAdminPassword(newPass: string): void {
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
}

export function getAnalyticsData(): AnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        totalVisits: 0,
        stepViews: {},
        dropOffs: {},
        completions: 0,
        sessions: [],
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      totalVisits: 0,
      stepViews: {},
      dropOffs: {},
      completions: 0,
      sessions: [],
    };
  }
}

export function saveAnalyticsData(data: AnalyticsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function trackVisit(): void {
  const data = getAnalyticsData();
  const sessionKey = 'cal_session_active';
  
  if (!sessionStorage.getItem(sessionKey)) {
    sessionStorage.setItem(sessionKey, 'true');
    data.totalVisits += 1;
    
    // Create new session log
    const newSession: SessionLog = {
      id: 'sess_' + Math.random().toString(36).substring(2, 9),
      startedAt: new Date().toISOString(),
      maxStep: 1,
      completed: false,
      answers: {},
    };
    data.sessions.unshift(newSession);
    sessionStorage.setItem('cal_current_session_id', newSession.id);
    
    // Keep max 100 recent sessions
    if (data.sessions.length > 100) {
      data.sessions = data.sessions.slice(0, 100);
    }
  }
  
  saveAnalyticsData(data);
}

export function trackStepProgress(stepId: number, answers: Record<number, string>): void {
  const data = getAnalyticsData();
  
  // Increment step view
  data.stepViews[stepId] = (data.stepViews[stepId] || 0) + 1;
  
  const sessionId = sessionStorage.getItem('cal_current_session_id');
  if (sessionId) {
    const session = data.sessions.find(s => s.id === sessionId);
    if (session) {
      if (stepId > session.maxStep) {
        session.maxStep = stepId;
      }
      session.answers = { ...answers };
      if (stepId >= quizData.length) {
        if (!session.completed) {
          session.completed = true;
          data.completions += 1;
        }
      }
    }
  }
  
  // Recalculate dropoffs based on active sessions max steps
  const dropOffCounts: Record<number, number> = {};
  data.sessions.forEach(s => {
    if (!s.completed && s.maxStep < quizData.length) {
      dropOffCounts[s.maxStep] = (dropOffCounts[s.maxStep] || 0) + 1;
    }
  });
  data.dropOffs = dropOffCounts;
  
  saveAnalyticsData(data);
}

export function seedDemoData(): void {
  const demoSessions: SessionLog[] = [
    { id: 'sess_demo1', startedAt: new Date(Date.now() - 3600000 * 2).toISOString(), maxStep: 29, completed: true, answers: { 3: 'Estou sedentária', 5: 'Emagrecer e definir' } },
    { id: 'sess_demo2', startedAt: new Date(Date.now() - 3600000 * 4).toISOString(), maxStep: 29, completed: true, answers: { 3: 'Já tentei antes', 5: 'Ganhar força' } },
    { id: 'sess_demo3', startedAt: new Date(Date.now() - 3600000 * 5).toISOString(), maxStep: 7, completed: false, answers: { 3: 'Estou sedentária' } },
    { id: 'sess_demo4', startedAt: new Date(Date.now() - 3600000 * 6).toISOString(), maxStep: 10, completed: false, answers: { 3: 'Treino de vez em quando' } },
    { id: 'sess_demo5', startedAt: new Date(Date.now() - 3600000 * 8).toISOString(), maxStep: 15, completed: false, answers: { 3: 'Estou sedentária' } },
    { id: 'sess_demo6', startedAt: new Date(Date.now() - 3600000 * 12).toISOString(), maxStep: 28, completed: false, answers: { 3: 'Estou sedentária', 5: 'Emagrecer e definir' } },
    { id: 'sess_demo7', startedAt: new Date(Date.now() - 3600000 * 24).toISOString(), maxStep: 29, completed: true, answers: { 3: 'Já tenho uma rotina' } },
    { id: 'sess_demo8', startedAt: new Date(Date.now() - 3600000 * 30).toISOString(), maxStep: 4, completed: false, answers: {} },
    { id: 'sess_demo9', startedAt: new Date(Date.now() - 3600000 * 36).toISOString(), maxStep: 10, completed: false, answers: {} },
    { id: 'sess_demo10', startedAt: new Date(Date.now() - 3600000 * 48).toISOString(), maxStep: 29, completed: true, answers: { 3: 'Estou sedentária' } },
  ];

  const stepViews: Record<number, number> = {
    1: 45, 2: 42, 3: 40, 4: 38, 5: 37, 6: 35, 7: 34, 8: 32, 9: 31, 10: 30,
    11: 26, 12: 25, 13: 24, 14: 23, 15: 22, 16: 20, 17: 19, 18: 18, 19: 17, 20: 16,
    21: 15, 22: 15, 23: 14, 24: 14, 25: 14, 26: 14, 27: 14, 28: 13, 29: 5
  };

  const dropOffs: Record<number, number> = {
    3: 2,
    7: 4,
    10: 8,
    15: 2,
    18: 1,
    28: 8
  };

  const demoData: AnalyticsData = {
    totalVisits: 45,
    stepViews,
    dropOffs,
    completions: 5,
    sessions: demoSessions,
  };

  saveAnalyticsData(demoData);
}

export function clearAnalyticsData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
