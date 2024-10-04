<?php

namespace Leo\Compains\Controllers;

use App\Http\Controllers\Controller;
use Leo\Campains\Models\Campains;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;
class CampainsController extends Controller
{

    public function index (){
        $result= Campains::all();
        return Inertia::render('Campains/Index',['dataCampaigns'=>$result]);
    }
     /**
     * Store a newly created campaign in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Define the validation rules and custom error messages
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'summary' => 'required|string|max:255',
            'link' => 'required|string|max:255',
            'start' => 'nullable|date',
            'end' => 'required|date',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ], [
            'title.required' => 'Tiêu đề là bắt buộc.',
            'summary.required' => 'Tóm tắt là bắt buộc.',
            'link.required' => 'Liên kết là bắt buộc.',
            'end.required' => 'Thời gian kết thúc là bắt buộc.',
            'image.image' => 'Tệp phải là hình ảnh.',
            'image.mimes' => 'Hình ảnh phải có định dạng jpg, jpeg, png, hoặc gif.',
            'image.max' => 'Kích thước hình ảnh tối đa là 2MB.',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        if (!Storage::disk('public')->exists('campains')) {
            Storage::disk('public')->makeDirectory('campains');
        }
        $validatedData = $validator->validated();
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('campains', 'public');
            $validatedData['image'] = $imagePath;
        }

        // Create and store the campaign
        $campain = Campains::create($validatedData);

        // Return success response
        return response()->json(['check' => true, 'campain' => $campain], 201);
    }

    /**
     * Display the specified campaign.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $campain = Campains::find($id);
        if (!$campain) {
            return response()->json(['check' => false, 'msg' => 'Campain not found.'], 404);
        }
        return response()->json(['check' => true, 'campain' => $campain], 200);
    }

    /**
     * Update the specified campaign in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $campain = Campains::find($id);
        if (!$campain) {
            return response()->json(['check' => false, 'msg' => 'Campain not found.'], 404);
        }

        // Define the validation rules and custom error messages
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'summary' => 'sometimes|required|string|max:255',
            'link' => 'sometimes|required|string|max:255',
            'start' => 'nullable|date',
            'end' => 'sometimes|required|date',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ], [
            'title.required' => 'Tiêu đề là bắt buộc.',
            'summary.required' => 'Tóm tắt là bắt buộc.',
            'link.required' => 'Liên kết là bắt buộc.',
            'end.required' => 'Thời gian kết thúc là bắt buộc.',
            'image.image' => 'Tệp phải là hình ảnh.',
            'image.mimes' => 'Hình ảnh phải có định dạng jpg, jpeg, png, hoặc gif.',
            'image.max' => 'Kích thước hình ảnh tối đa là 2MB.',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }

        // Handle file upload if exists
        $validatedData = $validator->validated();
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($campain->image) {
                Storage::disk('public')->delete($campain->image);
            }

            // Store new image
            $imagePath = $request->file('image')->store('campains', 'public');
            $validatedData['image'] = $imagePath;
        }

        // Update the campaign
        $campain->update($validatedData);

        // Return success response
        return response()->json(['check' => true, 'campain' => $campain], 200);
    }

    /**
     * Remove the specified campaign from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $campain = Campains::find($id);
        if (!$campain) {
            return response()->json(['check' => false, 'msg' => 'Campain not found.'], 404);
        }

        // Delete image if exists
        if ($campain->image) {
            Storage::disk('public')->delete($campain->image);
        }

        $campain->delete();

        return response()->json(['check' => true, 'msg' => 'Campain deleted successfully.'], 200);
    }
    // ================================================================
    public function api_index()
    {
        $currentDateTime = Carbon::now();

        $campain = Campains::
            orderBy('id', 'desc')
            ->first();
        
        if ($campain) {
            return response()->json($campain);
        } else {
            return response()->json(['message' => 'No upcoming campaigns found'], 404);
        }
    }
}
