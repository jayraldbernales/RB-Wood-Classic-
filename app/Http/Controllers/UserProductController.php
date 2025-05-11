<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class UserProductController extends Controller
{
    /**
     * Get popular products (reusable method)
     */
    private function getPopularProducts()
    {
        return Product::with('images')
            ->orderBy('created_at', 'asc')
            ->limit(4)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'images' => $product->images->map(function ($image) {
                        return [
                            'url' => asset('storage/' . $image->image),
                            'id' => $image->id
                        ];
                    }),
                ];
            });
    }

    /**
     * Home page after login - now shows popular products
     */
    public function home()
    {
        return Inertia::render('Homepage/HeroSection', [
            'popularProducts' => $this->getPopularProducts()
        ]);
    }

    /**
     * Overview page - now identical to home()
     */
    public function overview()
    {
        return $this->home();
    }

    /**
     * Display all products
     */
    public function index(Request $request)
    {
        $categoryId = $request->input('category');
        $searchTerm = $request->input('search');
        
        $categories = Category::all();
        
        // Replace paginate() with get()
        $products = Product::with(['category', 'images'])
            ->when($categoryId, function ($query) use ($categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->when($searchTerm, function ($query) use ($searchTerm) {
                return $query->where('name', 'like', "%{$searchTerm}%");
            })
            ->orderBy('created_at', 'desc')
            ->get(); // Changed from paginate(8)

        return Inertia::render('Homepage/Product', [
            'products' => $products, // Now returns a collection instead of paginator
            'categories' => $categories,
            'popularProducts' => $this->getPopularProducts(),
            'filters' => [
                'category' => $categoryId,
                'search' => $searchTerm
            ]
        ]);
    }

    /**
     * Show single product details
     */
    public function show(Product $product)
    {
        $product->load(['category', 'images']);
        
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('images')
            ->limit(4)
            ->get();

        return Inertia::render('Homepage/Product', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }

    /**
     * Overview page
     */

}