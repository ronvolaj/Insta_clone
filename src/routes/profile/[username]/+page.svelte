<script>
    let { data } = $props();
    let profileUser = $derived(data.profileUser);
    let images = $derived(data.images ?? []);
    let totalVotes = $derived(data.totalVotes ?? 0);
    let currentUser = $derived(data.user);
    let isOwn = $derived(currentUser?.username === profileUser?.username);
</script>

<svelte:head>
    <title>@{profileUser?.username} — Fotofy</title>
</svelte:head>

<main class="max-w-5xl mx-auto px-4 py-10 font-[Inter,sans-serif]">

    <!-- Profile Header -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <!-- Avatar -->
        {#if profileUser.avatar}
            <img src={profileUser.avatar} alt={profileUser.username} class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"/>
        {:else}
            <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold shadow-md border-4 border-white">
                {profileUser.username[0].toUpperCase()}
            </div>
        {/if}

        <div class="text-center sm:text-left">
            <h1 class="text-[22px] font-bold text-gray-900">@{profileUser.username}</h1>
            <p class="text-gray-400 text-[13px] mt-0.5">Member since {new Date(profileUser.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long' })}</p>

            <!-- Stats -->
            <div class="flex items-center justify-center sm:justify-start gap-6 mt-4">
                <div class="text-center">
                    <p class="text-[20px] font-bold text-gray-900">{images.length}</p>
                    <p class="text-[12px] text-gray-400">Photos</p>
                </div>
                <div class="w-px h-8 bg-gray-200"></div>
                <div class="text-center">
                    <p class="text-[20px] font-bold text-gray-900">{totalVotes}</p>
                    <p class="text-[12px] text-gray-400">Votes</p>
                </div>
            </div>

            {#if isOwn}
                <a href="/upload" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium rounded-xl transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Upload Photo
                </a>
            {/if}
        </div>
    </div>

    <!-- Photo Grid -->
    {#if images.length === 0}
        <div class="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-[15px]">No photos yet.</p>
        </div>
    {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each images as img}
                <a href="/image/{img.id}" class="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square block hover:shadow-md transition-shadow">
                    <img src={img.image} alt={img.description ?? 'Photo'} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                        <div class="flex items-center gap-2 text-white text-[12px]">
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
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</main>
