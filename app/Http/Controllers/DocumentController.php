<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\ScholarshipApplication;
use App\Services\StorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function store(Request $request, ScholarshipApplication $application)
    {
        // Authorize that user can update this application
        $this->authorize('update', $application);

        $request->validate([
            'document' => ['required', 'file', 'max:10240'], // 10MB max
            'type' => ['required', 'string', 'in:transcripts,recommendation_letter,financial_statement,grades,indigency,good_moral,parent_consent,recommendation'],
        ]);

        $path = StorageService::store($request->file('document'), 'documents');

        $document = Document::create([
            'application_id' => $application->id,
            'type' => $request->type,
            'file_path' => $path,
            'original_name' => $request->file('document')->getClientOriginalName(),
            'file_size' => $request->file('document')->getSize(),
            'mime_type' => $request->file('document')->getMimeType(),
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'document' => [
                'id' => $document->id,
                'type' => $document->type,
                'original_name' => $document->original_name,
                'status' => $document->status,
                'uploaded_at' => $document->created_at->format('Y-m-d H:i:s'),
            ]
        ]);
    }

    public function update(Request $request, Document $document)
    {
        // Authorize that user can update this application
        $this->authorize('update', $document->application);

        $request->validate([
            'document' => ['required', 'file', 'max:10240'],
        ]);

        // Delete old file
        StorageService::delete($document->file_path);

        // Store new file
        $path = StorageService::store($request->file('document'), 'documents');

        $document->update([
            'file_path' => $path,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Document updated successfully');
    }

    public function destroy(Document $document)
    {
        // Authorize that user can update this application
        $this->authorize('update', $document->application);

        StorageService::delete($document->file_path);
        $document->delete();

        return back()->with('success', 'Document deleted successfully');
    }
}
