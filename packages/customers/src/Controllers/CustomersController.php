<?php

namespace Leo\Customers\Controllers;

use Leo\Customers\Models\Customers;
use Illuminate\Http\Request;
use Leo\Customers\Requests\CustomerRequest;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Leo\Customers\Mail\createUser;
use Illuminate\Support\Facades\Auth;
use Leo\Bills\Models\Bills;
use Leo\Bills\Models\Bill_Detail;
class CustomersController
{
    /**
     * Display a listing of the resource.
     */
    public function submitForgetPassword(Request $request,Customers $customers)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
            'token'=>'required',
            'password'=>'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $customer = Customers::where('email',$request->email)->first();
        $token= $customer->token;
        if($token!= $request->token){
            return response()->json(['check'=>false,'msg'=>'Mã Token không hợp lệ']);
        }
        $customer->update(['password'=> Hash::make($request->password),'token'=>'','updated_at'=>now()]);
        return response()->json(['check'=>true]);
        
    }
    /**
     * Show the form for creating a new resource.
     */
    public function get_bills(Request $request)
    {
        $bills = Bills::with(['details.product'])
            ->where('email', Auth::user()->email)
            ->paginate(4) // paginate with 4 items per page
            ->through(function ($bill) {
                $total = $bill->details->reduce(function ($carry, $detail) {
                    $productDiscount = $detail->product->discount;
                    $quantity = $detail->quantity;
                    return $carry + ($productDiscount * $quantity);
                }, 0);
                $bill->total = $total;
                return $bill;
            });

        return response ()->json($bills);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerRequest $request)
    {
        $request->validated();
        $data['name']=$request->name;
        $data['email']=$request->email;
        $data['password']=Hash::make($request->password);
        Customers::create($data);
        return response()->json(['check'=>true]);
    }

    // ==============================
    public function CheckLogin(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        if (Auth::guard('customer')->attempt(['email' => $request->email, 'password' => $request->password,'status'=>1], true)) {
            $customer = Auth::guard('customer')->user();
            $customer->tokens()->delete();
            $token = $customer->createToken('CustomerToken')->plainTextToken;
            return response()->json([
                'check' => true,
                'id'=>$customer->id,
                'token' => $token,
            ]);
        }else{
            return response()->json(['check'=>false,'msg'=>'Sai email hoặc mật khẩu']);
        }
    }
     /**
     * Display the specified resource.
     */
    public function CheckLoginEmail(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
    
        // Find the customer by email and check if they are active (status = 1)
        $customer = Customers::where('email', $request->email)->where('status', 1)->first();
    
        if ($customer) {
            // Delete old tokens and create a new one
            $customer->tokens()->delete();
            $token = $customer->createToken('CustomerToken')->plainTextToken;
    
            return response()->json([
                'check' => true,
                'id' => $customer->id,
                'token' => $token,
            ]);
        } else {
            // Return failure message if the customer is not active or does not exist
            return response()->json(['check' => false, 'msg' => 'Email không hợp lệ hoặc tài khoản không hoạt động']);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Customers $customers)
    {
        $result = Customers::where('id',Auth::id())->first();
        return response()->json($result);
    }
    public function show_detail(Request $request,$id)
    {
        
        $bill = Bills::with('details.product')->find($id);
        $total = $bill->details->sum(function($detail) {
            return $detail->quantity * $detail->product->price;
        });
       $billList = Bill_Detail::with(['product','product.gallery'])->where('hoa_don_chi_tiet.id_hoa_don',$id)->select()->get();
       return response()->json($billList);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customers $customers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customers $customers,$id)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'email|unique:customers,email',
            'name' => 'unique:customers,name',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $customer= Customers::where('status',1)->where('id',$id)->first();
        if(!$customer){
            return response()->json(['check'=>false,'msg'=>'Tài khoản không tồn tại']);
        }
        $data= $request->all();
        if($request->has('email')){
            $data['email_verified_at']=null;
        }
        if($request->has('password') && $data['password']){
            $data['password']=Hash::make($data['password']);
        }
        $data['updated_at']= now();
        Customers::where('id',$id)->update($data);
        $customers=Customers::where('id',Auth::id())->first();
        return response()->json(['check'=>true]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function checkMailForget (Request $request,Customers $customers)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:customers,email',
        ],[
            'email.required'=>'Chưa nhận được email',
            'email.email'=>'Email không hợp lệ',
            'email.exists'=>'Email không tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $customer = Customers::where('email',$request->email)->first();
        $token= random_int(1000,9999);
        $customer->update(['token'=>$token]);
        $data = [
            'email' => $customer->email,
            'token' => $token,
        ];
        Mail::to($customer->email)->send(new createUser($data));
        return response()->json(['check'=>true]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customers $customers)
    {
        //
    }
}
