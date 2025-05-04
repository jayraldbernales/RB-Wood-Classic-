<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        $products = Product::with(['category', 'images'])->get(); // Load products with their images and category
    
            // Return the admin view
            return inertia('Admin/Product', [
                'categories' => $categories,
                'products' => $products,
            ]);
        
    }

    public function create()
    {
        $categories = Category::all(); // Fetch all categories for dropdown

        return Inertia::render('Admin/Product', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'images' => 'required|array', // Ensure images are an array
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048', // Validate each image
        ]);

        DB::transaction(function () use ($request) {
            // Create product
            $product = Product::create([
                'name' => $request->name,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'price' => $request->price,
            ]);

            // Store multiple images
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $imagePath,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Product added successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'removedImages' => 'nullable|array',
            'removedImages.*' => 'exists:product_images,id,product_id,' . $product->id,
        ]);

        DB::transaction(function () use ($request, $product) {
            // Update product details
            $product->update([
                'name' => $request->name,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'price' => $request->price,
            ]);

            // Remove selected images
            if ($request->removedImages) {
                foreach ($request->removedImages as $imageId) {
                    $image = ProductImage::findOrFail($imageId);
                    if (Storage::disk('public')->exists($image->image)) {
                        Storage::disk('public')->delete($image->image);
                    }
                    $image->delete();
                }
            }

            // Add new images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imagePath = $image->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imagePath,
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id); // Manually find the product
    
        DB::transaction(function () use ($product) {
            foreach ($product->images as $image) {
                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
                $image->delete();
            }
    
            $product->delete();
        });
    
    }
    
}