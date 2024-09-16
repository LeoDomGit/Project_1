<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class ConversationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Conversation $conversation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Conversation $conversation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id )
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
          
        ], [
            'name.required' => 'Chưa có tên của chat box',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $conversation = Conversation::find($id);
        if(!$conversation){
            return response()->json(['check' => false, 'msg' => 'Không tìm thấy cuộc trò chuyện']);
        }
        $conversation->name = $request->name;
        $conversation->updated_at = now();
        $conversation->save();
        return response()->json(['check' => true, 'data' => $conversation]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Conversation $conversation)
    {
        //
    }
}
