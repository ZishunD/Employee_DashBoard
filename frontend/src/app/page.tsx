'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Upload, Trash2 } from 'lucide-react';

export default function Page() {
  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [employeeFile, setEmployeeFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [reportDragActive, setReportDragActive] = useState(false);
  const [employeeDragActive, setEmployeeDragActive] = useState(false);

  const reportsInputRef = useRef<HTMLInputElement>(null);
  const employeeInputRef = useRef<HTMLInputElement>(null);

  // Helpers to add files, deduplicate by name+size (optional)
  const addReportFiles = (files: FileList | null) => {
    if (!files) return;
    setReportFiles((prev) => {
      // Prevent duplicates by name + size
      const newFiles = Array.from(files).filter(
        (file) => !prev.some((f) => f.name === file.name && f.size === file.size)
      );
      return [...prev, ...newFiles];
    });
  };

  const onReportsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addReportFiles(e.target.files);
    e.target.value = '';
  };

  const onEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setEmployeeFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const removeReportFile = (index: number) => {
    setReportFiles((files) => files.filter((_, i) => i !== index));
  };

  const removeEmployeeFile = () => setEmployeeFile(null);

  // Drag handlers for reports
  const handleReportDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReportDragActive(true);
  };
  const handleReportDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReportDragActive(false);
  };
  const handleReportDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReportDragActive(false);
    addReportFiles(e.dataTransfer.files);
  };
  const handleReportClick = () => reportsInputRef.current?.click();

  // Drag handlers for employee
  const handleEmployeeDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEmployeeDragActive(true);
  };
  const handleEmployeeDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEmployeeDragActive(false);
  };
  const handleEmployeeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEmployeeDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      setEmployeeFile(e.dataTransfer.files[0]);
    }
  };
  const handleEmployeeClick = () => employeeInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFile || reportFiles.length === 0) {
      alert('Please upload all necessary files');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    reportFiles.forEach((file) => formData.append('reports', file));
    formData.append('employees', employeeFile);

    try {
      const res = await axios.post('http://localhost:5000/api/analyze', formData);
      setResults(res.data);
    } catch {
      alert('Failed to upload, check file types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees')
      .then(res => setResults(res.data))
      .catch(() => {});
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-slate-800">📊 Upload Dashboard Files</h1>

      {/* Results Table */}
      {results.length > 0 && (
        <section className="my-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">📋 Analysis Results</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-slate-100 text-left text-slate-700 font-medium">
                <tr>
                  <th className="px-4 py-3 border-b">Employee Name</th>
                  <th className="px-4 py-3 border-b">Join Date</th>
                  <th className="px-4 py-3 border-b">Role</th>
                  <th className="px-4 py-3 border-b">Team Member</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2 border-b">{row.name}</td>
                    <td className="px-4 py-2 border-b">{row.joinDate}</td>
                    <td className="px-4 py-2 border-b">{row.role}</td>
                    <td className="px-4 py-2 border-b">{row.teamMember}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-white shadow rounded-lg p-6 border border-slate-200"
      >
        {/* Daily Report Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            📅 Daily Report Files (.xls, .xlsx)
          </label>
          <div
            onDragEnter={handleReportDragEnter}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setReportDragActive(true); }}
            onDragLeave={handleReportDragLeave}
            onDrop={handleReportDrop}
            onClick={handleReportClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleReportClick(); }}
            className={`relative flex flex-col items-center justify-center border-2 rounded-md p-8 cursor-pointer select-none
              ${reportDragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-slate-300 bg-slate-50'}
              transition-colors duration-200`}
          >
            <Upload className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm text-slate-600">
              Drag & drop files here or click to select
            </span>
            <input
              type="file"
              multiple
              accept=".xls,.xlsx"
              ref={reportsInputRef}
              onChange={onReportsChange}
              className="hidden"
            />
          </div>

          {reportFiles.length > 0 && (
            <ul className="mt-4 space-y-2 max-h-40 overflow-auto border border-slate-200 rounded-md p-3 bg-slate-50">
              {reportFiles.map((file, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate text-slate-700 max-w-xs" title={file.name}>
                    📁 {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeReportFile(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* New Employee Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            🧍 New Employee File (.xls, .xlsx)
          </label>
          <div
            onDragEnter={handleEmployeeDragEnter}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setEmployeeDragActive(true); }}
            onDragLeave={handleEmployeeDragLeave}
            onDrop={handleEmployeeDrop}
            onClick={handleEmployeeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEmployeeClick(); }}
            className={`relative flex flex-col items-center justify-center border-2 rounded-md p-8 cursor-pointer select-none
              ${employeeDragActive ? 'border-green-500 bg-green-50' : 'border-dashed border-slate-300 bg-slate-50'}
              transition-colors duration-200`}
          >
            <Upload className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm text-slate-600">
              Drag & drop a file here or click to select
            </span>
            <input
              type="file"
              accept=".xls,.xlsx"
              ref={employeeInputRef}
              onChange={onEmployeeChange}
              className="hidden"
            />
          </div>

          {employeeFile && (
            <div className="mt-4 flex items-center justify-between bg-green-50 px-4 py-2 rounded text-sm text-slate-800 max-w-xs">
              <span className="truncate" title={employeeFile.name}>
                📁 {employeeFile.name}
              </span>
              <button
                type="button"
                onClick={removeEmployeeFile}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remove file ${employeeFile.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Processing...' : '📈 Analyze'}
        </button>
      </form>
    </main>
  );
}
