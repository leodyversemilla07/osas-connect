# PDF Generation System

The `PdfController` handles the generation of official scholarship documents and application forms by merging student data into pre-defined PDF templates.

## Technical Architecture

The system utilizes `php-pdftk` (a wrapper for the PDF Toolkit) to fill PDF forms.

### 1. Template Management
Templates are expected to be available in the storage path. The controller supports:
- **CHED Application Forms**
- **Annex 1 Forms**

### 2. Data Mapping
The `prepareFormData`, `prepareChedFormData`, and `prepareAnnex1FormData` methods are responsible for mapping Eloquent model attributes to PDF form field names.

### 3. Image Handling
`getImagePathForPdf()` handles the retrieval of student photos, including downloading from cloud storage (CloudCube) to temporary local paths for processing.

### 4. Security & Cleanup
Temporary files are created for filled PDFs and cleaned up after the download response is initiated to ensure no sensitive data persists on the server filesystem.

## Troubleshooting pdftk

The controller includes diagnostic methods to verify `pdftk` availability:
- `isPdftkAvailable()`
- `getPdftkCommand()`
- `testPdftkCommand()`

---

> [!IMPORTANT]
> Ensure `pdftk` is installed on the server and accessible by the web server user.
