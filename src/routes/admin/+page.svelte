<script>
    import { enhance } from '$app/forms';
    let { data, form } = $props();
    let users = $derived(data.users ?? []);
    let recentImages = $derived(data.recentImages ?? []);
    let tab = $state('users');
</script>

<svelte:head>
    <title>Admin Panel — Fotofy</title>
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-10 font-[Inter,sans-serif]">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
        <div class="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
        </div>
        <div>
            <h1 class="text-[22px] font-bold text-gray-900">Admin Panel</h1>
            <p class="text-[13px] text-gray-400">Manage users and content</p>
        </div>
    </div>

    {#if form?.error}
        <div class="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500">
            {form.error}
        </div>
    {/if}

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div class="bg-gray-50 rounded-2xl p-4">
            <p class="text-[24px] font-bold text-gray-900">{users.length}</p>
            <p class="text-[12px] text-gray-400">Users</p>
        </div>
        <div class="bg-gray-50 rounded-2xl p-4">
            <p class="text-[24px] font-bold text-gray-900">{recentImages.length}</p>
            <p class="text-[12px] text-gray-400">Recent Photos</p>
        </div>
        <div class="bg-gray-50 rounded-2xl p-4">
            <p class="text-[24px] font-bold text-gray-900">{users.reduce((s,u) => s + (u.image_count??0), 0)}</p>
            <p class="text-[12px] text-gray-400">Total Photos</p>
        </div>
        <div class="bg-gray-50 rounded-2xl p-4">
            <p class="text-[24px] font-bold text-gray-900">{users.reduce((s,u) => s + (Number(u.total_votes)??0), 0)}</p>
            <p class="text-[12px] text-gray-400">Total Votes</p>
        </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        <button onclick={() => tab='users'} class="px-4 py-2 text-[13px] font-medium rounded-lg transition-colors {tab==='users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}">Users</button>
        <button onclick={() => tab='images'} class="px-4 py-2 text-[13px] font-medium rounded-lg transition-colors {tab==='images' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}">Photos</button>
    </div>

    <!-- Users Tab -->
    {#if tab === 'users'}
        <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table class="w-full text-[13px]">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="text-left px-4 py-3 font-medium text-gray-500">User</th>
                        <th class="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Email</th>
                        <th class="text-center px-4 py-3 font-medium text-gray-500">Photos</th>
                        <th class="text-center px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Votes</th>
                        <th class="text-center px-4 py-3 font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as u}
                        <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors {u.banned ? 'opacity-50' : ''}">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <a href="/profile/{u.username}" class="font-medium text-gray-800 hover:text-blue-500 transition-colors">
                                        @{u.username}
                                    </a>
                                    {#if u.role === 'admin'}
                                        <span class="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">Admin</span>
                                    {/if}
                                    {#if u.banned}
                                        <span class="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">Banned</span>
                                    {/if}
                                </div>
                            </td>
                            <td class="px-4 py-3 text-gray-400 hidden sm:table-cell">{u.email}</td>
                            <td class="px-4 py-3 text-center text-gray-700">{u.image_count}</td>
                            <td class="px-4 py-3 text-center text-gray-700 hidden sm:table-cell">{u.total_votes}</td>
                            <td class="px-4 py-3">
                                <div class="flex items-center justify-center gap-1.5">

                                    <!-- Promote/Demote admin -->
                                    <form method="POST" action="?/toggleAdmin" use:enhance>
                                        <input type="hidden" name="user_id" value={u.id}/>
                                        <input type="hidden" name="current_role" value={u.role}/>
                                        <button type="submit"
                                            onclick={(e) => { if (!confirm(u.role === 'admin' ? 'Remove admin?' : 'Make admin?')) e.preventDefault(); }}
                                            title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                                            class="px-2 py-1 text-[11px] font-medium rounded-lg transition-colors
                                                {u.role === 'admin' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}">
                                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                                        </button>
                                    </form>

                                    <!-- Ban/Unban -->
                                    <form method="POST" action="?/toggleBan" use:enhance>
                                        <input type="hidden" name="user_id" value={u.id}/>
                                        <input type="hidden" name="banned" value={u.banned ? '1' : '0'}/>
                                        <button type="submit"
                                            onclick={(e) => { if (!confirm(u.banned ? 'Unban this user?' : 'Ban this user?')) e.preventDefault(); }}
                                            title={u.banned ? 'Unban user' : 'Ban user'}
                                            class="px-2 py-1 text-[11px] font-medium rounded-lg transition-colors
                                                {u.banned ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}">
                                            {u.banned ? 'Unban' : 'Ban'}
                                        </button>
                                    </form>

                                    <!-- Delete user -->
                                    <form method="POST" action="?/deleteUser" use:enhance>
                                        <input type="hidden" name="user_id" value={u.id}/>
                                        <button type="submit"
                                            onclick={(e) => { if (!confirm('Delete this user and all their content?')) e.preventDefault(); }}
                                            title="Delete user"
                                            class="px-2 py-1 text-[11px] font-medium bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    <!-- Photos Tab -->
    {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {#each recentImages as img}
                <div class="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
                    <img src={img.image} alt="" class="w-full h-full object-cover"/>
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                        <span class="text-white/80 text-[11px]">@{img.username}</span>
                        <form method="POST" action="?/deleteImage" use:enhance>
                            <input type="hidden" name="image_id" value={img.id}/>
                            <button type="submit"
                                aria-label="Delete image"
                                onclick={(e) => { if (!confirm('Delete this image?')) e.preventDefault(); }}
                                class="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>