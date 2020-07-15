<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;

class InterviewController extends Controller
{
    public function index()
    {
        return json_decode(Storage::get('interview.json'), true);
    }
}
