"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { BulkImportModal } from "./bulk-import-modal";

export function BulkImportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Import Excel
      </button>

      <BulkImportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
