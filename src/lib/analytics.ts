import { supabase } from './supabase';

const getSessionId = () => {
  let sid = sessionStorage.getItem('session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('session_id', sid);
  }
  return sid;
};

export const trackPageView = async (section: string) => {
  try {
    await supabase.from('page_views').insert({ section, session_id: getSessionId() });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

export const trackClick = async (item_type: string, item_id: string, item_title: string, action: string) => {
  try {
    await supabase.from('item_clicks').insert({ item_type, item_id, item_title, action, session_id: getSessionId() });
  } catch (error) {
    console.error('Failed to track click:', error);
  }
};
