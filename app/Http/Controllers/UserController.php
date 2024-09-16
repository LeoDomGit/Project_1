<?php

namespace App\Http\Controllers;

use App\Mail\createUser;
use App\Models\Role;
use App\Models\User;
use App\Traits\HasCrud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
    protected $model;

    use HasCrud;
    public function __construct()
    {
        $this->model = User::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        $roles = Role::all();
        return Inertia::render('Users/Index', ['users' => $users, 'roles' => $roles]);
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
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'idRole' => 'required|exists:roles,id',
          
        ], [
            'name.required' => 'Chưa nhận được tên tài khoản',
            'idRole.required' => 'Chưa nhận được loại tài khoản',
            'idRole.exists' => 'Loại tài khoản không tồn tại',
            'email.required' => 'Chưa nhận được email',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        $password = random_int(10000, 99999);
        $data['password'] = Hash::make($password);
        User::create($data);
        $data = [
            'email' => $request->email,
            'password' => $password,
        ];
        Mail::to($request->email)->send(new createUser($data));
        $users = $this->model::with('roles')->get();
        return response()->json(['check' => true,'data'=>$users]);
    }
    /**
     * Display the specified resource.
     */
    public function login(Request $request)
    {
        return Inertia::render('Users/Login');
    }
    
    /**
     * Display the specified resource.
     */
    public function checkLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $user = User::where('email', $request->email)->first();
        if(Auth::attempt(['email'=>$request->email,'password'=>$request->password,'status'=>1],true)){
            return response()->json(['check' => true, 'msg' => 'Đăng nhập thành công']);
        }else{
            return response()->json(['check' => false, 'msg' => 'Sai tên đăng nhập hoặc mật khẩu']);
        }
    }
     /**
     * Display the specified resource.
     */
    public function checkLoginEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['check' => false, 'msg' => 'Email không tồn tại']);
        }

        if ($user->status != 1) {
            return response()->json(['check' => false, 'msg' => 'Tài khoản đã bị khóa']);
        }
        Auth::login($user,true);
        return response()->json(['check' => true, 'msg' => 'Email hợp lệ']);
    }
     /**
     * Display the specified resource.
     */
    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }
    
        //

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $result= $this->updateTraits($this->model, $id, $request->all());
        $result =$this->model::with('roles')->get();
        return response()->json(['check'=>true,'data'=>$result], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
