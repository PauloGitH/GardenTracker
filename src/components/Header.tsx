import React from 'react';
import { Flower, Sun, Cloud, Leaf } from 'lucide-react';

interface HeaderProps {
  gardenName: string;
  onEditGardenName: () => void;
}

const Header: React.FC<HeaderProps> = ({ gardenName, onEditGardenName }) => {
  return (
    <header className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Leaf className="h-8 w-8 mr-2 text-emerald-200" />
          <h1 className="text-2xl font-bold cursor-pointer hover:underline" onClick={onEditGardenName}>
            {gardenName}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-emerald-800 bg-opacity-50 rounded-full px-4 py-1">
            <Sun className="h-5 w-5 text-yellow-300 mr-2" />
            <span className="text-sm">June 15, 2025</span>
          </div>
          
          <div className="flex items-center bg-emerald-800 bg-opacity-50 rounded-full px-4 py-1">
            <Cloud className="h-5 w-5 text-blue-200 mr-2" />
            <span className="text-sm">Partly Cloudy, 72°F</span>
          </div>
          
          <div className="flex items-center bg-emerald-800 bg-opacity-50 rounded-full px-4 py-1">
            <Flower className="h-5 w-5 text-pink-300 mr-2" />
            <span className="text-sm">Spring Season</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;