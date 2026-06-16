<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
    let user = $derived(data.user);
    let images = $derived(data.images ?? []);
    let deleting = $state(null);
    let expandedFilter = $state(null); // which image has filter panel open

    const filters = {
        none:       { label: 'Original',  css: '' },
        grayscale:  { label: 'B&W',       css: 'grayscale(100%)' },
        sepia:      { label: 'Sepia',     css: 'sepia(100%)' },
        saturate:   { label: 'Vivid',     css: 'saturate(200%)' },
        contrast:   { label: 'Contrast',  css: 'contrast(150%)' },
        brightness: { label: 'Bright',    css: 'brightness(130%)' },
        cool:       { label: 'Cool',      css: 'hue-rotate(180deg) saturate(120%)' },
        warm:       { label: 'Warm',      css: 'sepia(50%) saturate(150%)' },
        fade:       { label: 'Fade',      css: 'brightness(110%) saturate(80%)' },
        drama:      { label: 'Drama',     css: 'contrast(130%) brightness(90%)' },
        vintage:    { label: 'Vintage',   css: 'sepia(40%) contrast(110%) brightness(90%)' },
        invert:     { label: 'Invert',    css: 'invert(100%)' },
    };

    function filterCss(f) {
        return filters[f]?.css ?? '';
    }
</script>

<svelte:head>
    <title>Dashboard — Fotofy</title>
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-10 font-[Inter,sans-serif]">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div class="flex items-center gap-4">
            {#if user?.avatar}
                <img src={user.avatar} alt={user.username} class="w-14 h-14 rounded-full object-cover border-2 border-blue-100"/>
            {:else}
                <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                </div>
            {/if}
            <div>
                <h1 class="text-[22px] font-bold text-gray-900">Your Dashboard</h1>
                <p class="text-gray-400 text-[13px]">@{user?.username}</p>
            </div>
        </div>
        <a href="/upload" class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-[13.5px] font-medium rounded-xl transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Upload Photo
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 mb-10">
        <div class="bg-gray-50 rounded-2xl p-4 text-center">
            <p class="text-[24px] font-bold text-gray-900">{images.length}</p>
            <p class="text-[12px] text-gray-400 mt-0.5">Photos</p>
        </div>
        <div class="bg-gray-50 rounded-2xl p-4 text-center">
            <p class="text-[24px] font-bold text-gray-900">{images.reduce((s,i) => s + (i.votes ?? 0), 0)}</p>
            <p class="text-[12px] text-gray-400 mt-0.5">Total Votes</p>
        </div>
        <div class="bg-gray-50 rounded-2xl p-4 text-center">
            <p class="text-[24px] font-bold text-gray-900">{images.reduce((s,i) => s + (i.comment_count ?? 0), 0)}</p>
            <p class="text-[12px] text-gray-400 mt-0.5">Comments</p>
        </div>
    </div>

    <!-- Images -->
    {#if images.length === 0}
        <div class="text-center py-24 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-[15px] mb-4">You haven't uploaded any photos yet.</p>
            <a href="/upload" class="px-5 py-2.5 bg-blue-500 text-white text-[13px] font-medium rounded-xl hover:bg-blue-600 transition-colors">Upload your first photo</a>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each images as img}
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

                    <!-- Image -->
                    <a href="/image/{img.id}" class="block relative aspect-square overflow-hidden">
                        <img
                            src={img.image}
                            alt={img.description ?? 'Photo'}
                            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            style="filter: {filterCss(img.filter ?? 'none')}"
                        />
                        {#if img.filter && img.filter !== 'none'}
                            <div class="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                                {filters[img.filter]?.label ?? img.filter}
                            </div>
                        {/if}
                    </a>

                    <!-- Bottom bar -->
                    <div class="p-3 flex items-center justify-between">
                        <div class="flex items-center gap-3 text-[12px] text-gray-400">
                            <span class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                </svg>
                                {img.votes}
                            </span>
                            <span class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                                {img.comment_count}
                            </span>
                        </div>
                        <div class="flex items-center gap-1">
                            <!-- Filter toggle button -->
                            <button
                                type="button"
                                onclick={() => expandedFilter = expandedFilter === img.id ? null : img.id}
                                class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors {expandedFilter === img.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}"
                                title="Edit filter"
                            >
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                                </svg>
                            </button>
                            <!-- Delete button -->
                            <form method="POST" action="?/delete" use:enhance={() => {
                                deleting = img.id;
                                return async ({ update }) => { await update(); deleting = null; };
                            }}>
                                <input type="hidden" name="image_id" value={img.id}/>
                                <button type="submit"
                                    onclick={(e) => { if (!confirm('Delete this photo?')) e.preventDefault(); }}
                                    class="w-7 h-7 bg-gray-100 hover:bg-red-500 text-gray-500 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                                    disabled={deleting === img.id}>
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Filter Panel -->
                    {#if expandedFilter === img.id}
                        <div class="px-3 pb-3 border-t border-gray-50 pt-3">
                            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Choose Filter</p>
                            <div class="grid grid-cols-6 gap-1.5">
                                {#each Object.entries(filters) as [key, val]}
                                    <form method="POST" action="?/updateFilter" use:enhance={() => {
                                        return async ({ update }) => { await update({ reset: false }); };
                                    }}>
                                        <input type="hidden" name="image_id" value={img.id}/>
                                        <input type="hidden" name="filter" value={key}/>
                                        <button
                                            type="submit"
                                            class="w-full flex flex-col items-center gap-1 p-1 rounded-lg transition-all
                                                {(img.filter ?? 'none') === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}"
                                        >
                                            <div class="w-full aspect-square rounded-md overflow-hidden">
                                                <img src={img.image} alt={val.label} class="w-full h-full object-cover" style="filter: {val.css}"/>
                                            </div>
                                            <span class="text-[9px] text-gray-500 leading-tight">{val.label}</span>
                                        </button>
                                    </form>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</main>