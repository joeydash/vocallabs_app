import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { navigation } from './navigation';
import { ChevronDown, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../../services/auth';
import { useTheme } from './ThemeContext';
import { ProfileModal } from '../profile/ProfileModal';
import { cn } from '../../utils/cn';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  return (
    <div className="flex flex-col w-64 bg-gray-800 h-full">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <img 
          src="https://cdn.subspace.money/grow90_tracks/images/Jy0e6SZqiGaIMShho6c4.png"
          alt="Logo"
          className="h-8 w-auto"
        />
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2",
                    "text-sm font-medium rounded-md text-gray-300",
                    "hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transform transition-transform duration-200",
                      expandedItems.includes(item.name) && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "ml-8 mt-1 space-y-1 transition-all duration-200",
                    expandedItems.includes(item.name) ? "block" : "hidden"
                  )}
                >
                  {item.submenu.map((subItem) => (
                    <NavLink
                      key={subItem.name}
                      to={subItem.to}
                      onClick={onClose}
                      className={({ isActive }) => cn(
                        "block px-4 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      )}
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-gray-700">
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
            className={cn(
              "flex items-center w-full px-4 py-2",
              "text-sm font-medium text-gray-300 rounded-md",
              "hover:bg-gray-700 hover:text-white",
              "transition-colors duration-200"
            )}
          >
            <img 
              src={user?.dp || "https://cdn.subspace.money/grow90_tracks/images/FGvzvKGIy0z7DRBW673v.png"}
              alt={user?.fullname || "Profile"}
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
            <div className="flex-1 text-left">
              <p className="font-medium">{user?.fullname || user?.phone}</p>
              <p className="text-xs text-gray-400">View options</p>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 transform transition-transform duration-200",
              showProfileMenu && "rotate-180"
            )} />
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-700 rounded-md shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowProfileModal(true);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </div>
  );
}
