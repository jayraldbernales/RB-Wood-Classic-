<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product.images'])
            ->latest()
            ->get();
            
        return inertia('Admin/Orders', ['orders' => $orders]);
    }

    public function edit($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        return inertia('Admin/OrderEdit', ['order' => $order]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,ongoing,processing,completed,cancelled',
            'payment_status' => 'required|in:unpaid,partially_paid,paid,failed',
            'start_date' => 'nullable|date',
            'estimated_completion_date' => 'nullable|date',
            'actual_completion_date' => 'nullable|date',
        ]);

        $order->update($validated);
        
        return redirect()->route('admin.orders')
            ->with('success', 'Order updated successfully');
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        
        return redirect()->route('admin.orders')
            ->with('success', 'Order deleted successfully');
    }

    public function dashboardStats()
    {
        // Get monthly order data for the chart
        $monthlyData = Order::selectRaw('
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                COUNT(*) as count
            ')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
    
        // Prepare chart data
        $chartLabels = [];
        $chartData = [];
        
        // Generate labels and data for the last 7 months
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $chartLabels[] = $date->format('M');
            
            $found = $monthlyData->first(function ($item) use ($date) {
                return $item->year == $date->year && $item->month == $date->month;
            });
            
            $chartData[] = $found ? $found->count : 0;
        }
    
        return response()->json([
            'today_orders' => Order::whereDate('created_at', today())->count(),
            'monthly_orders' => Order::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'year_orders' => Order::whereYear('created_at', now()->year)->count(),
            'pending_deliveries' => Order::where('status', '!=', 'completed')
                ->where('status', '!=', 'cancelled')
                ->count(),
            'recent_orders' => Order::with(['user'])
                ->latest()
                ->take(4)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'time' => $order->created_at->diffForHumans(),
                        'amount' => (float)$order->total_amount,
                        'status' => $order->status,
                    ];
                }),
            'chart_data' => [ // Add this new field
                'labels' => $chartLabels,
                'data' => $chartData,
            ],
        ]);
    }
    
}