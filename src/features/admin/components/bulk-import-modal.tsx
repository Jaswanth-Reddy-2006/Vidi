"use client";

import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, Loader2 } from "lucide-react";
import { bulkImportProducts } from "../actions/bulk-import-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BulkImportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a valid .xlsx or .csv file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await bulkImportProducts(formData);
    
    if (res.success) {
      toast.success(res.message);
      setFile(null);
      onClose();
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Import Products via Excel</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Need a template? Download our sample CSV file to see the required format.
            </p>
            <a 
              href="/templates/products-import.csv" 
              download
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline whitespace-nowrap ml-4"
            >
              Download Template
            </a>
          </div>
        </div>

        <div className="p-8">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
              ${file ? 'border-maroon-500 bg-maroon-50 dark:bg-maroon-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-maroon-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              accept=".xlsx,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <FileSpreadsheet className="w-12 h-12 text-maroon-600 mb-4" />
                <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white text-lg">Click or drag Excel file here</p>
                <p className="text-sm text-gray-500 mt-2">Supports .xlsx and .csv formats</p>
                
                <a href="/templates/vidi-products-template.xlsx" onClick={e => e.stopPropagation()} className="mt-6 text-sm font-medium text-maroon-700 dark:text-maroon-400 hover:underline">
                  Download Sample Template
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
}
