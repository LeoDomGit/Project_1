<?php

namespace Leo\Services\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Leo\Services\Models\ServiceBills;
use App\Http\Requests\StoreServiceBillsRequest;
use App\Http\Requests\UpdateServiceBillsRequest;
use Carbon\Carbon;
use Leo\Services\Models\ServiceBillsDetails;

class ServiceBillsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $serviceBills = ServiceBillsDetails::with('service_bills.customer', 'service', 'booking')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($serviceBill) {
                $total = 0;
                $carbon = Carbon::parse($serviceBill->booking->time)->format('H:i:s Y-m-d');
                return [
                    'id' => $serviceBill->id,
                    'customer_name' => $serviceBill->service_bills->customer->name,
                    'customer_email' => $serviceBill->service_bills->customer->email,
                    'customer_phone' => $serviceBill->service_bills->customer->phone,
                    'booking_date' => $carbon,
                    'service_name' => $serviceBill->service->name,
                    'service_price' => $serviceBill->service->price,
                    'status' => $serviceBill->service_bills->status,
                    'total' => $serviceBill->service->price
                ];
            });
        return Inertia::render('ServiceBills/Index', ['serviceBills' => $serviceBills]);
    }

    public function apiBill()
    {
        $serviceBills = ServiceBillsDetails::with('service_bills.customer', 'service')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($serviceBill) {
                $total = 0;
                return [
                    'id' => $serviceBill->id,
                    'customer_name' => $serviceBill->service_bills->customer->name,
                    'customer_email' => $serviceBill->service_bills->customer->email,
                    'customer_phone' => $serviceBill->service_bills->customer->phone,
                    'booking_date' => $serviceBill->service_bills->created_at,
                    'service_name' => $serviceBill->service->name,
                    'service_price' => $serviceBill->service->price,
                    'status' => $serviceBill->service_bills->status,
                    'total' => $total
                ];
            });
        return response()->json(['check' => true, 'serviceBill' => $serviceBills]);
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
    public function store(StoreServiceBillsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceBills $serviceBills)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceBills $serviceBills)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceBillsRequest $request, ServiceBills $serviceBills)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceBills $serviceBills)
    {
        //
    }
}