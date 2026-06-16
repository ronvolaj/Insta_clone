<script>
    let { form } = $props();
    let preview = $state(null);
    let dragging = $state(false);

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file);
        }
    }

    function handleChange(e) {
        handleFile(e.target.files?.[0]);
    }

    function handleDrop(e) {
        e.preventDefault();
        dragging = false;
        handleFile(e.dataTransfer.files?.[0]);
    }

    let selectedFilter = $state('none');

function filterStyle(f) {
    const filters = {
        none: '',
        grayscale: 'grayscale(100%)',
        sepia: 'sepia(100%)',
        saturate: 'saturate(200%)',
        contrast: 'contrast(150%)',
        brightness: 'brightness(130%)',
        invert: 'invert(100%)',
        blur: 'blur(2px)'
    };
    return filters[f] ?? '';
}
</script>

<svelte:head>
    <title>Upload Photo — Fotofy</title>
</svelte:head>

<main class="max-w-lg mx-auto px-4 py-12 font-[Inter,sans-serif]">
    <h1 class="text-[24px] font-bold text-gray-900 mb-1">Upload a Photo</h1>
    <p class="text-gray-400 text-[14px] mb-8">Share a moment with the community.</p>

    {#if form?.error}
        <div class="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-500">
            {form.error}
        </div>
    {/if}

    <form method="POST" enctype="multipart/form-data" class="flex flex-col gap-4">

        <!-- Drop zone -->
        <label
            for="image"
            class="relative flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed cursor-pointer transition-colors
                {dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40'}"
            ondragover={(e) => { e.preventDefault(); dragging = true; }}
            ondragleave={() => dragging = false}
            ondrop={handleDrop}
        >
            {#if preview}
                <img src={preview} alt="Preview" class="absolute inset-0 w-full h-full object-cover rounded-2xl"/>
                <div class="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span class="text-white text-[13px] font-medium bg-black/50 px-3 py-1.5 rounded-lg">Change photo</span>
                </div>
            {:else}
                <svg class="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-[14px] text-gray-400">Drag & drop or <span class="text-blue-500 font-medium">browse</span></p>
                <p class="text-[12px] text-gray-300 mt-1">JPG, PNG, GIF, WEBP</p>
            {/if}
        </label>
        <input type="file" id="image" name="image" accept="image/*" onchange={handleChange} class="hidden" required/>

        <!-- Description -->
        <div>
            <label for="description" class="block text-[13px] font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
                id="description" name="description" rows="3"
                placeholder="Write a caption for your photo..."
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-400 outline-none resize-none focus:border-blue-500 focus:bg-white transition-colors"
            ></textarea>
        </div>

        <!-- Filter Picker -->
<div>
    <label class="block text-[13px] font-medium text-gray-600 mb-2">Filter</label>
    <div class="grid grid-cols-4 gap-2">
        {#each ['none','grayscale','sepia','saturate','contrast','brightness','invert','blur'] as f}
            <label class="cursor-pointer">
                <input type="radio" name="filter" value={f} class="hidden" bind:group={selectedFilter}/>
                <div class="rounded-xl overflow-hidden border-2 transition-all {selectedFilter === f ? 'border-blue-500' : 'border-transparent'}">
                    {#if preview}
                        <img src={preview} alt={f} class="w-full aspect-square object-cover" style="filter: {filterStyle(f)}"/>
                    {:else}
                        <div class="w-full aspect-square bg-gray-100"></div>
                    {/if}
                    <p class="text-center text-[11px] text-gray-500 py-1">{f}</p>
                </div>
            </label>
        {/each}
    </div>
</div>

        <button type="submit"
            class="w-full py-3 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-[14px] font-medium rounded-xl transition-all shadow-sm">
            Publish Photo
        </button>
    </form>
</main>
