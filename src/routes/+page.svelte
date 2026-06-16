<script>
    let { data } = $props();
    let featured = $derived(data.featured ?? []);
    let recent = $derived(data.recent ?? []);

    const filters = {
        none: '',
        grayscale: 'grayscale(100%)',
        sepia: 'sepia(100%)',
        saturate: 'saturate(200%)',
        contrast: 'contrast(150%)',
        brightness: 'brightness(130%)',
        cool: 'hue-rotate(180deg) saturate(120%)',
        warm: 'sepia(50%) saturate(150%)',
        fade: 'brightness(110%) saturate(80%)',
        drama: 'contrast(130%) brightness(90%)',
        vintage: 'sepia(40%) contrast(110%) brightness(90%)',
        invert: 'invert(100%)',
        blur: 'blur(2px)'
    };

    function filterStyle(f) {
        return filters[f] ?? '';
    }
</script>

<svelte:head>
    <title>Fotofy — Share your moments</title>
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-10 font-[Inter,sans-serif]">

    <!-- Hero -->
    <div class="mb-12 text-center">
        <h1 class="text-[32px] sm:text-[40px] font-bold text-gray-900 tracking-tight leading-tight mb-3">
            Share your <span class="text-blue-500">moments</span>
        </h1>
        <p class="text-gray-400 text-[15px] max-w-md mx-auto">
            Discover beautiful photos from creators around the world.
        </p>
    </div>

    <!-- Top Rated Section -->
    {#if featured.length > 0}
        <section class="mb-14">
            <div class="flex items-center gap-2 mb-5">
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <h2 class="text-[17px] font-semibold text-gray-800">Top Rated</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {#each featured as img, i}
                    <a href="/image/{img.id}" class="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square block shadow-sm hover:shadow-lg transition-shadow">
                        <img src={img.image} alt={img.description ?? 'Photo'} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style:filter={filterStyle(img.filter ?? 'none')}/>
ter ?? 'none')}/>

                        <!-- Rank badge -->
                        <div class="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold
                            {i===0 ? 'bg-yellow-400 text-yellow-900' : i===1 ? 'bg-gray-300 text-gray-700' : 'bg-orange-300 text-orange-900'}">
                            {i+1}
                        </div>
                        <!-- Votes badge -->
                        <div class="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[12px] font-medium px-2 py-1 rounded-full">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                            </svg>
                            {img.votes}
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                            <p class="text-white text-[13px] font-medium truncate">{img.description ?? ''}</p>
                            <p class="text-white/60 text-[12px] mt-0.5">@{img.username}</p>
                        </div>
                    </a>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Recent Feed -->
    <section>
        <h2 class="text-[17px] font-semibold text-gray-800 mb-5">Recent Photos</h2>

        {#if recent.length === 0}
            <div class="text-center py-24 text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-[15px]">No photos yet. Be the first to upload!</p>
                <a href="/register" class="mt-4 inline-block px-5 py-2.5 bg-blue-500 text-white text-[13px] font-medium rounded-xl hover:bg-blue-600 transition-colors">Get Started</a>
            </div>
        {:else}
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {#each recent as img}
                    <a href="/image/{img.id}" class="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square block hover:shadow-md transition-shadow">
                        <img src={img.image} alt={img.description ?? 'Photo'} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style:filter={img.filter ?? ''}/>
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p class="text-white text-[12px] truncate">{img.description ?? ''}</p>
                            <div class="flex items-center justify-between mt-1">
                                <p class="text-white/70 text-[11px]">@{img.username}</p>
                                <div class="flex items-center gap-1 text-white/70 text-[11px]">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                    </svg>
                                    {img.votes}
                                </div>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </section>
</main>