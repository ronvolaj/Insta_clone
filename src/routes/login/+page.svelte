<script>
    let { form } = $props();
</script>

<svelte:head>
    <title>Login — Fotofy</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex font-[Inter,sans-serif]">

    <!-- Left: Form -->
    <div class="w-[420px] shrink-0 bg-white flex flex-col justify-center px-10 py-16">

        <!-- Logo -->
        <div class="flex items-center gap-2.5 mb-10">
            <div class="w-[34px] h-[34px] bg-blue-500 rounded-[9px] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="5" width="16" height="12" rx="2.5" stroke="white" stroke-width="1.6"/>
                    <circle cx="10" cy="11" r="3" stroke="white" stroke-width="1.6"/>
                    <path d="M7 5l1.5-2h3L13 5" stroke="white" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
            </div>
            <span class="text-[19px] font-semibold text-gray-900 tracking-tight">
                Foto<span class="text-blue-500">fy</span>
            </span>
        </div>

        <!-- Heading -->
        <h1 class="text-[22px] font-semibold text-gray-900 tracking-tight mb-1">Welcome back</h1>
        <p class="text-[13px] text-gray-400 mb-7">Sign in to your account.</p>

        <!-- Error -->
        {#if form?.error}
            <div class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-500">
                {form.error}
            </div>
        {/if}

        <!-- Form -->
        <form method="POST" class="flex flex-col gap-2.5">
            <input
                type="email" name="email" placeholder="Email" required
                value={form?.email ?? ''}
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px]
                       text-gray-900 placeholder:text-gray-400 outline-none
                       focus:border-blue-500 focus:bg-white transition-colors"
            />
            <input
                type="password" name="password" placeholder="Password" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px]
                       text-gray-900 placeholder:text-gray-400 outline-none
                       focus:border-blue-500 focus:bg-white transition-colors"
            />
            <button type="submit"
                class="w-full mt-1 py-3 bg-blue-500 hover:bg-blue-700 text-white text-[13.5px]
                       font-medium rounded-xl transition-colors active:scale-[0.98]">
                Sign in
            </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px bg-gray-100"></div>
            <span class="text-[12px] text-gray-300">or</span>
            <div class="flex-1 h-px bg-gray-100"></div>
        </div>

        <!-- Register link -->
        <p class="text-center text-[13px] text-gray-400">
            Don't have an account?
            <a href="/register" class="text-blue-500 font-medium hover:underline">Register</a>
        </p>
    </div>

    <!-- Right: Decorative panel -->
    <div class="hidden md:flex flex-1 bg-blue-50 flex-col items-center justify-center gap-8 px-10">

        <p class="text-[28px] font-semibold text-blue-900 text-center leading-snug tracking-tight">
            Every picture<br>tells a story.
        </p>

        <!-- Photo grid -->
        <div class="grid grid-cols-2 gap-2.5 w-full max-w-[260px]">
            <div class="aspect-square bg-white border border-blue-200 rounded-2xl flex items-center justify-center">
                <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
            <div class="aspect-square bg-white border border-blue-200 rounded-2xl flex items-center justify-center mt-5">
                <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
            </div>
            <div class="aspect-square bg-white border border-blue-200 rounded-2xl flex items-center justify-center -mt-5">
                <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
            </div>
            <div class="aspect-square bg-white border border-blue-200 rounded-2xl flex items-center justify-center">
                <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
        </div>

        <span class="text-[11px] text-blue-700 font-medium tracking-widest uppercase">
            Share · Discover · Connect
        </span>

        <div class="flex gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
        </div>
    </div>

</div>