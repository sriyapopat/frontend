import { Shield, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onGenerateData: () => void;
  isGenerating: boolean;
}

export const Header = ({ onGenerateData, isGenerating }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Fraud Intelligence</h1>
            <p className="text-sm text-gray-400">Real-time Transaction Monitoring</p>
          </div>
        </div>
        <button
          onClick={onGenerateData}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate Data'}
        </button>
      </div>
    </header>
  );
};
