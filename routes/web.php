<?php

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PayMongoController;
use App\Http\Controllers\UserProductController;
use App\Http\Controllers\ProfileController;
use App\Models\Contact;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

Route::get('/storage/{folder}/{filename}', function ($folder, $filename) {
    $path = $folder . '/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    
    return new StreamedResponse(function () use ($path) {
        echo Storage::disk('public')->get($path);
    }, 200, [
        'Content-Type' => Storage::disk('public')->mimeType($path),
        'Content-Disposition' => 'inline; filename="' . $filename . '"',
    ]);
});

// Public Routes
Route::get('/', function () {
    return Inertia::render('LandingPage');
});

// Contact Message
Route::post('/contact', [ContactMessageController::class, 'store'])->name('contact.store');

Route::get('/linkstorage', function () {
    try {
        Artisan::call('storage:link');
        return 'Storage link created successfully!';
    } catch (\Exception $e) {
        return 'Error creating storage link: ' . $e->getMessage();
    }
});


// Single Checkout
Route::get('/checkout/product/{product}', [CheckoutController::class, 'showSingleProduct'])
    ->name('checkout.product.show');
Route::post('/checkout/product/{product}', [CheckoutController::class, 'storeSingleProduct'])
    ->name('checkout.product.store');

// Checkout
Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');

// PayMongo
Route::post('/paymongo/payment-intent', [PaymentController::class, 'createPaymentIntent'])
    ->name('paymongo.payment-intent');  // Add this name

Route::post('/paymongo/create-checkout', [PaymentController::class, 'createCheckout'])
    ->name('paymongo.create-checkout');  // Add this name

Route::post('/paymongo/webhook', [PaymentController::class, 'handleWebhook'])
    ->name('paymongo.webhook');  // Add this name


// Orders
Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])
    ->name('orders.cancel');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
Route::get('/orders/confirmation', [OrderController::class, 'confirmation'])->name('orders.confirmation');
Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
Route::get('/failed', function () {
    return Inertia::render('Orders/Failed');
})->name('orders.failed');

// Public Product Routes
Route::get('/products', [UserProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [UserProductController::class, 'show'])->name('products.show');

// Authentication Routes
require __DIR__.'/auth.php';

// Authenticated Routes
Route::middleware('auth')->group(function () {
    // User Routes
    Route::middleware('role:user')->group(function () {
        // Carts
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
        Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
        Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');

        // Main routes
        Route::get('/home', [UserProductController::class, 'home'])->name('home');
        Route::get('/overview', [UserProductController::class, 'overview'])->name('overview');
        

        
        Route::get('/settings', [ProfileController::class, 'edit'])->name('settings.edit');

    });

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        Route::get('/overview', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.overview');
        
        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders');
        Route::get('/orders/{order}/edit', [AdminOrderController::class, 'edit'])->name('admin.orders.edit');
        Route::put('/orders/{order}', [AdminOrderController::class, 'update'])->name('admin.orders.update');
        Route::delete('/orders/{id}', [AdminOrderController::class, 'destroy'])->name('admin.orders.destroy');
        Route::get('/dashboard-stats', [AdminOrderController::class, 'dashboardStats']);
        

        // API routes for orders
        Route::get('/api/orders', [AdminOrderController::class, 'index']);
        Route::get('/api/orders/{id}', [AdminOrderController::class, 'show']);
        Route::delete('/api/orders/{id}', [AdminOrderController::class, 'destroy']);

       // Contact Messages
        Route::get('/contact-messages', function () {
            return Contact::orderBy('created_at', 'desc')->get();
        })->name('admin.contact-messages');
        
        Route::delete('/contact-messages/{contact}', [ContactMessageController::class, 'destroy'])
            ->name('admin.contact-messages.destroy');
        
            
        // Products
        Route::get('/product', [AdminProductController::class, 'index'])->name('admin.product.index');
        Route::get('/product/create', [AdminProductController::class, 'create'])->name('admin.product.create');
        Route::post('/product', [AdminProductController::class, 'store'])->name('admin.product.store');
        Route::get('/product/{product}/edit', [AdminProductController::class, 'edit'])->name('admin.product.edit');
        Route::put('/product/{product}', [AdminProductController::class, 'update'])->name('admin.product.update');
        Route::delete('/product/{product}', [AdminProductController::class, 'destroy'])->name('admin.product.destroy');
        
        // Categories
        Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');
        
        // Users
        Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
        
    });

    // Common Authenticated Routes
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
