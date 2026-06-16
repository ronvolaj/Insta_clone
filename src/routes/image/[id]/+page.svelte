<script>
    import { enhance } from '$app/forms';
    let { data, form } = $props();
    let img = $derived(data.image);
    let comments = $derived(data.comments ?? []);
    let hasVoted = $derived(data.hasVoted ?? false);
    let user = $derived(data.user);
    let commentText = $state('');
    let voting = $state(false);
</script>

<svelte:head>
    <title>{img?.description ?? 'Photo'} — Fotofy</title>
</svelte:head>

<main class="max-w-5xl mx-auto px-4 py-10 font-[Inter,sans-serif]">
    <div class="flex flex-col lg:flex-row gap-8">

        <!-- Image Panel -->
        <div class="flex-1 min-w-0">
            <div class="rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                <img src={img.image} alt={img.description ?? 'Photo'} class="w-full object-contain max-h-[70vh]" style="filter: {img.filter ?? ''}"/>
            </div>
        </div>

        <!-- Side Panel -->
        <div class="w-full lg:w-[320px] shrink-0 flex flex-col gap-5">

            <!-- Author -->
            <div class="flex items-center gap-3">
                <a href="/profile/{img.username}">
                    {#if img.avatar}
                        <img src={img.avatar} alt={img.username} class="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-400 transition-all"/>
                    {:else}
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[14px] hover:ring-2 hover:ring-blue-400 transition-all">
                            {img.username[0].toUpperCase()}
                        </div>
                    {/if}
                </a>
                <div>
                    <a href="/profile/{img.username}" class="text-[14px] font-semibold text-gray-900 hover:text-blue-500 transition-colors">
                        @{img.username}
                    </a>
                    <p class="text-[12px] text-gray-400">{new Date(img.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
                </div>
            </div>

            <!-- Description -->
            {#if img.description}
                <p class="text-[14px] text-gray-700 leading-relaxed">{img.description}</p>
            {/if}

            <!-- Vote button -->
            <form method="POST" action="?/vote" use:enhance={() => {
                voting = true;
                return async ({ update }) => { await update(); voting = false; };
            }}>
                <button type="submit" disabled={!user || voting}
                    class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border
                        {hasVoted
                            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-500'}
                        {!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ">
                    <svg class="w-4 h-4" fill="{hasVoted ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                    </svg>
                    {img.votes} {img.votes === 1 ? 'Vote' : 'Votes'}
                </button>
                {#if !user}
                    <p class="text-[12px] text-gray-400 mt-1.5"><a href="/login" class="text-blue-500 hover:underline">Login</a> to vote.</p>
                {/if}
            </form>

            <!-- Comments section -->
            <div class="border-t border-gray-100 pt-5">
                <h2 class="text-[14px] font-semibold text-gray-800 mb-4">
                    Comments <span class="text-gray-400 font-normal">({comments.length})</span>
                </h2>

                <!-- Comment list -->
                <div class="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 mb-4">
                    {#if comments.length === 0}
                        <p class="text-[13px] text-gray-400">No comments yet. Be the first!</p>
                    {:else}
                        {#each comments as c}
                            <div class="flex gap-2.5">
                                {#if c.avatar}
                                    <img src={c.avatar} alt={c.username} class="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"/>
                                {:else}
                                    <div class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-[11px] font-semibold shrink-0 mt-0.5">
                                        {c.username[0].toUpperCase()}
                                    </div>
                                {/if}
                                <div class="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                                    <p class="text-[12px] font-semibold text-gray-700">{c.username}</p>
                                    <p class="text-[13px] text-gray-600 mt-0.5 leading-snug">{c.text}</p>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>

                <!-- Comment form -->
                {#if user}
                    {#if form?.commentError}
                        <p class="text-[12px] text-red-500 mb-2">{form.commentError}</p>
                    {/if}
                    <form method="POST" action="?/comment" use:enhance={() => {
                        return async ({ update }) => { commentText = ''; await update(); };
                    }} class="flex gap-2">
                        <input
                            type="text" name="text" bind:value={commentText}
                            placeholder="Add a comment…"
                            class="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                            required
                        />
                        <button type="submit"
                            class="px-3 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                        </button>
                    </form>
                {:else}
                    <p class="text-[13px] text-gray-400">
                        <a href="/login" class="text-blue-500 hover:underline font-medium">Login</a> to leave a comment.
                    </p>
                {/if}
            </div>
        </div>
    </div>
</main>
