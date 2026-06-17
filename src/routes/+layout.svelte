<script>
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    let { children, data } = $props();
    let user = $derived(data?.user ?? null);
    let mobileMenuOpen = $state(false);
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Navigation -->
<nav class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm font-[Inter,sans-serif]">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        <!-- Logo -->
        <a href="/" class="flex items-center gap-2 shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="5" width="16" height="12" rx="2.5" stroke="white" stroke-width="1.6"/>
                    <circle cx="10" cy="11" r="3" stroke="white" stroke-width="1.6"/>
                    <path d="M7 5l1.5-2h3L13 5" stroke="white" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
            </div>
            <span class="text-[17px] font-semibold text-gray-900 tracking-tight">
                Foto<span class="text-blue-500">fy</span>
            </span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
            <a href="/" class="px-3 py-1.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Home</a>
            {#if user}
                <a href="/dashboard" class="px-3 py-1.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Dashboard</a>
                <a href="/upload" class="px-3 py-1.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Upload</a>
                {#if user.role === 'admin'}
                    <a href="/admin" class="px-3 py-1.5 text-[13px] text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">Admin</a>
                {/if}
                <a href="/profile/{user.username}" class="flex items-center gap-2 ml-2 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-colors">
                    {#if user.avatar}
                        <img src={user.avatar} alt={user.username} class="w-7 h-7 rounded-full object-cover"/>
                    {:else}
                        <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[11px] font-semibold">
                            {user.username[0].toUpperCase()}
                        </div>
                    {/if}
                    <span class="text-[13px] font-medium text-gray-700">{user.username}</span>
                    {#if user.role === 'admin'}
                        <span class="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Admin</span>
                    {/if}
                </a>
                <form method="POST" action="/logout">
                    <button type="submit" class="ml-1 px-3 py-1.5 text-[13px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        Logout
                    </button>
                </form>
            {:else}
                <a href="/login" class="px-3 py-1.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Login</a>
                <a href="/register" class="ml-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium rounded-lg transition-colors">
                    Sign Up
                </a>
            {/if}
        </div>

        <!-- Mobile menu toggle -->
        <button class="md:hidden p-2 text-gray-500 hover:text-gray-800 rounded-lg" onclick={() => mobileMenuOpen = !mobileMenuOpen}>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {#if mobileMenuOpen}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                {/if}
            </svg>
        </button>
    </div>

    <!-- Mobile menu -->
    {#if mobileMenuOpen}
        <div class="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
            <a href="/" class="py-2 text-[14px] text-gray-700" onclick={() => mobileMenuOpen=false}>Home</a>
            {#if user}
                <a href="/dashboard" class="py-2 text-[14px] text-gray-700" onclick={() => mobileMenuOpen=false}>Dashboard</a>
                <a href="/upload" class="py-2 text-[14px] text-gray-700" onclick={() => mobileMenuOpen=false}>Upload</a>
                {#if user.role === 'admin'}
                    <a href="/admin" class="py-2 text-[14px] text-red-600 font-medium" onclick={() => mobileMenuOpen=false}>Admin</a>
                {/if}
                <a href="/profile/{user.username}" class="py-2 text-[14px] text-gray-700" onclick={() => mobileMenuOpen=false}>Profile</a>
                <form method="POST" action="/logout">
                    <button type="submit" class="py-2 text-[14px] text-red-500">Logout</button>
                </form>
            {:else}
                <a href="/login" class="py-2 text-[14px] text-gray-700" onclick={() => mobileMenuOpen=false}>Login</a>
                <a href="/register" class="py-2 text-[14px] text-blue-500 font-medium" onclick={() => mobileMenuOpen=false}>Sign Up</a>
            {/if}
        </div>
    {/if}
</nav>

{@render children()}

<!-- Footer -->
<footer class="mt-20 border-t border-gray-100 bg-white font-[Inter,sans-serif]">
    <div class="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="5" width="16" height="12" rx="2.5" stroke="white" stroke-width="1.8"/>
                    <circle cx="10" cy="11" r="3" stroke="white" stroke-width="1.8"/>
                    <path d="M7 5l1.5-2h3L13 5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <span class="text-[14px] font-semibold text-gray-700">Foto<span class="text-blue-500">fy</span></span>
        </div>
        <p class="text-[12px] text-gray-400">© 2025 Fotofy. Share your world.</p>
    </div>
</footer>

