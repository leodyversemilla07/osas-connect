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
        $request->validate([
            'document' => ['required', 'file', 'max:10240'], // 10MB max
            'type' => ['required', 'string', 'in:grades,indigency,good_moral,parent_consent,recommendation'],
        ]);

        $path = StorageService::store($request->file('document'), 'documents');

        $document = Document::create([
            'application_id' => $application->id,
            'type' => $request->type,
            'file_path' => $path,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Document uploaded successfully');
    }

    public function update(Request $request, Document $document)
    {
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
        StorageService::delete($document->file_path);
        $document->delete();

        return back()->with('success', 'Document deleted successfully');
    }
}
