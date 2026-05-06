import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BulkImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  
  const { login } = useAuth();
  
  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.');
        return;
      }
      setFile(selectedFile);
      
      // Parse file for preview
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          if (results.data && results.data.length > 0) {
            setPreview(results.data.slice(0, 3)); // Preview top 3 rows
          }
        }
      });
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Father Name,Mobile,Roll No,Class\nJohn Doe,Robert Doe,9876543210,101,Grade 10\nJane Smith,William Smith,9876543211,102,Grade 10";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to import.');
      return;
    }
    
    setLoading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function(results) {
        try {
          const parsedData = results.data.map(row => {
            // Map common CSV column names to our schema
            const mobileStr = (row['Mobile'] || row['mobile'] || row['Phone'] || '').toString().trim();
            const mobileWithCode = mobileStr.startsWith('+91') ? mobileStr : `+91${mobileStr}`;
            
            return {
              name: row['Name'] || row['name'] || '',
              fatherName: row['Father Name'] || row["Father's Name"] || row['fatherName'] || '',
              mobile: mobileWithCode,
              rollNo: (row['Roll No'] || row['rollNo'] || row['Roll Number'] || '').toString().trim(),
              classes: row['Class'] || row['classes'] || row['Grade'] || ''
            };
          });

          // Validate basic fields
          const invalidRows = parsedData.filter(d => !d.name || !d.fatherName || d.mobile === '+91' || !d.classes);
          if (invalidRows.length > 0) {
             setError(`Found ${invalidRows.length} rows with missing required fields (Name, Father Name, Mobile, Class). Please check your CSV.`);
             setLoading(false);
             return;
          }

          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem('token');
          if (token) await login(token);

          await axios.post(
            `${backendUrl}/api/create/students`,
            { students: parsedData },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          onImportSuccess();
          onClose();
        } catch (err) {
          console.error("Bulk import error:", err);
          setError(err.response?.data?.message || "Failed to import students. Please ensure roll numbers and mobiles are unique.");
        } finally {
          setLoading(false);
        }
      },
      error: function(err) {
        setError("Failed to parse CSV file: " + err.message);
        setLoading(false);
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-2xl overflow-hidden w-full max-w-lg mx-auto shadow-2xl border border-gray-100"
          >
            <div className="px-6 py-4 border-b bg-gradient-to-r from-green-500 to-emerald-600">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Bulk Import Students</h2>
                <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a CSV file to add multiple students at once. You can download our template to see the required format.
                </p>
                <button 
                  onClick={handleDownloadTemplate}
                  className="text-sm text-blue-600 font-medium hover:underline mb-4 inline-block"
                >
                  Download CSV Template
                </button>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-gray-600 font-medium">{file ? file.name : "Click or drag CSV file here"}</p>
                  </div>
                </div>
              </div>

              {preview.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto text-xs border">
                  <p className="font-semibold text-gray-700 mb-2">Preview (First 3 rows):</p>
                  <table className="min-w-full text-left">
                    <thead>
                      <tr>
                        {Object.keys(preview[0]).map(key => <th key={key} className="px-2 py-1 bg-gray-200 text-gray-600">{key}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((val, j) => <td key={j} className="px-2 py-1 border-b">{val}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition" disabled={loading}>
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !file}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center"
                >
                  {loading ? 'Importing...' : 'Import Students'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkImportModal;
