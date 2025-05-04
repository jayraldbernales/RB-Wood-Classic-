<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Fetch paginated users
     */
    public function index(Request $request)
    {
        $users = User::paginate(10); // Adjust items per page as needed
        return response()->json($users);
    }
}
