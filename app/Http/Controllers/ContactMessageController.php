<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index()
    {
        $messages = Contact::latest()->take(5)->get();
        return Inertia::render('Admin/Dashboard', [
            'messages' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        Contact::create($validated);

        return redirect()->back()->with('success', 'Message sent successfully!');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->noContent();
    }
}