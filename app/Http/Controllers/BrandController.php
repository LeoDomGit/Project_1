<?php

namespace App\Http\Controllers;

use App\Models\Brands;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands= Brands::all();
        return Inertia::render("Brands/Index",['brands'=>$brands]);
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
            'name' => 'required|unique:brands,name',
          
        ], [
            'name.required' => 'Chưa nhận được thương hiệu',
            'name.unique' => 'Thương hiệu bị trùng',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        $data['slug']= Str::slug($request->name);
        Brands::create($data);
        $brands= Brands::all();
        return response()->json(['check'=> true,'data'=> $brands]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brands $brands)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brands $brands)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brands $brands,$id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'unique:brands,name',
          
        ], [
            'name.required' => 'Chưa nhận được loại tài khoản',
            'name.unique' => 'Loại tài khoản bị trùng',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        if($request->has('name')){
            $data['slug']= Str::slug($request->name);
        }
        Brands::where('id',$id)->update($data);
        $brands=Brands::all();
        return response()->json(['check'=> true,'data'=> $brands]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brands $brands,$id)
    {
        $brand = Brands::find($id);
        if(!$brand){
            return response()->json(['check'=> true,'msg'=>'Không tìm được thương hiệu']);
        }
        $brand->delete();
        $brands=Brands::all();
        return response()->json(['check'=> true,'data'=> $brands]);
    }
}
