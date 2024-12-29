import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/layout/ThemeContext';
import { AuthProvider } from './services/auth/context/AuthContext';
import { CallModalProvider } from './components/shared/CallModalProvider';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { Home } from './pages/Home';
import { AgentList } from './pages/agents/AgentList';
import { EditAgent } from './pages/agents/EditAgent';
import { AgentTemplates } from './pages/agents/AgentTemplates';
import { ContactGroups } from './pages/contacts/ContactGroups';
import { ContactList } from './pages/contacts/ContactList';
import { AllContacts } from './pages/contacts/AllContacts';
import { CampaignList } from './pages/campaign/CampaignList';
import { CampaignTemplates } from './pages/campaign/CampaignTemplates';
import { CallQueue } from './pages/campaign/CallQueue'; // Updated name
import { CampaignQueueDetails } from './pages/campaign/CampaignQueueDetails';
import { Inbox } from './pages/Inbox';
import { CallHistory } from './pages/analytics/CallHistory';
import { CallData } from './pages/analytics/CallData';
import { Settings } from './pages/settings/Settings';
import { Integrations } from './pages/settings/Integrations';
import { PricingPage } from './pages/pricing/PricingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CallModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="agents">
                  <Route index element={<Navigate to="list" replace />} />
                  <Route path="list" element={<AgentList />} />
                  <Route path="edit/:id" element={<EditAgent />} />
                  <Route path="templates" element={<AgentTemplates />} />
                </Route>
                <Route path="contacts">
                  <Route index element={<Navigate to="groups" replace />} />
                  <Route path="groups" element={<ContactGroups />} />
                  <Route path="groups/:groupId" element={<ContactList />} />
                  <Route path="all" element={<AllContacts />} />
                </Route>
                <Route path="campaign">
                  <Route index element={<Navigate to="list" replace />} />
                  <Route path="list" element={<CampaignList />} />
                  <Route path="templates" element={<CampaignTemplates />} />
                  <Route path="queue" element={<CallQueue />} />
                  <Route path=":campaignId/queue" element={<CampaignQueueDetails />} />
                </Route>
                <Route path="inbox" element={<Inbox />} />
                <Route path="analytics">
                  <Route index element={<Navigate to="call-history" replace />} />
                  <Route path="call-history" element={<CallHistory />} />
                  <Route path="call-data" element={<CallData />} />
                </Route>
                <Route path="settings">
                  <Route index element={<Navigate to="general" replace />} />
                  <Route path="general" element={<Settings />} />
                  <Route path="integrations" element={<Integrations />} />
                </Route>
              </Route>
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </BrowserRouter>
        </CallModalProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
