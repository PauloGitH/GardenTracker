import React from 'react';
import { Leaf, Plus, Map, List, X } from 'lucide-react';

interface HeaderProps {
  editMode: boolean;
  onToggleEditMode: () => void;
  onToggleFilterPanel: () => void;
  filterPanelOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  editMode, 
  onToggleEditMode, 
  onToggleFilterPanel,
  filterPanelOpen
}) => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="text-green-600" size={28} />
          <h1 className="text-xl font-bold text-gray-800">Garden Mapper</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onToggleFilterPanel}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              filterPanelOpen 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterPanelOpen ? (
              <>
                <X size={16} className="mr-1" />
                Close Filters
              </>
            ) : (
              <>
                <List size={16} className="mr-1" />
                Plants
              </>
            )}
          </button>
          
          <button
            onClick={onToggleEditMode}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              editMode 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {editMode ? (
              <>
                <Map size={16} className="mr-1" />
                View Mode
              </>
            ) : (
              <>
                <Plus size={16} className="mr-1" />
                Edit Mode
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;