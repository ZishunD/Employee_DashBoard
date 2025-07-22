# Employee Dashboard File Uploader

A React (Next.js) frontend component for uploading Daily Report Excel files and a New Employee Excel file, with drag-and-drop support, file preview and removal, and an analysis result table.

## Features

- Upload multiple Daily Report files (.xls, .xlsx) with drag & drop and click-to-select.
- Upload a single New Employee file (.xls, .xlsx) with drag & drop and click-to-select.
- Prevent duplicate files in Daily Reports by file name and size.
- Preview uploaded files with file names and option to remove any.
- Submit files to backend API for processing.
- Display analysis results in a clean, responsive table.
- Custom lightweight toast notification popup for upload success/failure.
- Loading state during file upload.
- Fully styled with Tailwind CSS.
- Keyboard accessible drag/drop zones.
- Modern UX with clear visual feedback.

## Installation

This component is built with React and Tailwind CSS and intended for use in a Next.js project.

1. Clone this repository or copy the component files into your Next.js project.

2. Install dependencies:

```bash
npm install axios lucide-react
