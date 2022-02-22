import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import { SessionContext } from './context/SessionContext';
import CommandPalette from './components/CommandPalette';
import Navigation from './components/Navigation';
import Intro from './components/Intro';
import Auth from './components/Auth';
import Home from './components/Home';
import EntryItemView from './components/EntryItemView';
import LearnMore from './components/LearnMore';
import NotFound from './components/NotFound';

const App = () => {
  const [session, setSession] = useState(supabase.auth.session());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`Supabase auth event: ${_event}`);
      setSession(session);
    });
  }, [session]);

  useEffect(() => {
    if (session && location.pathname === '/signin') {
      return navigate('/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SessionContext.Provider value={session}>
      <CommandPalette>
        <Routes>
          <Route path="/" element={<Navigation />}>
            <Route index element={<Intro />} />
            <Route path="/signin" element={<Auth />} />
            {session ? (
              <Route path="/home" element={<Home />} />
            ) : (
              <Route path="/home" element={<Auth />} />
            )}
            <Route path="/new/:entry" element={<Home />} />
            <Route path="/:category/:entry" element={<EntryItemView />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CommandPalette>
    </SessionContext.Provider>
  );
};

export default App;
