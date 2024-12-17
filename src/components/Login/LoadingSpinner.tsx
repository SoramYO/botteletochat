import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center">
    <Loader className="animate-spin text-blue-500" size={24} />
  </div>
);