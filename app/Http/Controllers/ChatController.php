<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Conversation;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    protected $conversation;
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::user()->id;
        $conversation = Conversation::where('user_id', $userId)->orderBy('created_at', 'desc')->firstOrCreate(['user_id' => $userId]);
        $conversations= Conversation::where('user_id',$userId)->get();
        $chat=Chat::where('conversation_id',$conversation->id)->get()->toArray();
        $this->conversation = $conversation;
        return  inertia::render('Chat/Index', [
                'conversation' => $conversation,
                'chats'=>$chat,
                'title'=>'Chat',
                'conversations'=>$conversations  
        ]);
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
        $validator = Validator::make($request->all(), [
            'conversation_id' => 'required',
            'content' => 'required',
        ], [
            'conversation_id.required' => 'Chưa có tên của chat box',
            'content.required' => 'Chưa có tên của chat box',
            
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data=$request->all();
        $data['created_at']=now();
        Chat::create($data);
        $data=Chat::where('conversation_id',$data['conversation_id'])->get();
        return response()->json(['check' => true, 'data' => $data]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $chat=Chat::where('conversation_id',$id)->get();
        return response()->json(['check' => true, 'data' => $chat]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chat $chat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chat $chat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chat $chat)
    {
        //
    }
}
