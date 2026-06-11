<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
    let user = $derived(data.user);
    let images = $derived(data.images ?? []);
    let deleting = $state(null);
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

    <!-- Stats row -->
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

    <!-- Images grid -->
    {#if images.length === 0}
        <div class="text-center py-24 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-[15px] mb-4">You haven't uploaded any photos yet.</p>
            <a href="/upload" class="px-5 py-2.5 bg-blue-500 text-white text-[13px] font-medium rounded-xl hover:bg-blue-600 transition-colors">Upload your first photo</a>
        </div>
    {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {#each images as img}
                <div class="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
                    <a href="/image/{img.id}">
                        <img src={img.image} alt={img.description ?? 'Photo'} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    </a>
                    <!-- Overlay on hover -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none"></div>
                    <!-- Stats bar -->
                    <div class="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                        <div class="flex items-center gap-2 text-white text-[11px]">
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                </svg>
                                {img.votes}
                            </span>
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                                {img.comment_count}
                            </span>
                        </div>
                        <!-- Delete button -->
                        <form method="POST" action="?/delete" use:enhance={() => {
                            deleting = img.id;
                            return async ({ update }) => { await update(); deleting = null; };
                        }}>
                            <input type="hidden" name="image_id" value={img.id}/>
                            <button type="submit"
                                onclick={(e) => { if (!confirm('Delete this photo?')) e.preventDefault(); }}
                                class="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                                disabled={deleting === img.id}>
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>