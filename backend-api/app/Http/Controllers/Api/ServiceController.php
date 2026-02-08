<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // Admin creates service
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'warranty' => 'nullable|string|max:100',
        ]);

        $service = Service::create($data);

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service
        ]);
    }

    public function show(Service $service)
    {
    return response()->json($service);
        }

    // User sees services
    public function index()
    {
        return Service::where('is_active', true)->get();
    }
    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name'           => 'sometimes|required|string',
            'description'    => 'nullable|string',
            'price'          => 'sometimes|required|numeric',
            'duration_hours' => 'sometimes|required|integer',
            'warranty'       => 'nullable|string',
            'is_active'      => 'boolean'
        ]);

        $service->update($data);
        return response()->json(['message' => 'Updated successfully', 'service' => $service]);
    }

public function allServices(Request $request)
{
    $query = Service::latest();
    if ($request->has('search')) {
        $search = $request->get('search');
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }
    return response()->json($query->paginate(6));
}

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'message' => 'Service deleted'
        ]);
    }
}
