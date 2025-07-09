const UserTable = (users = []) => `
<table class="min-w-full text-xs table-auto">
  <thead>
    <tr class="bg-blue-100">
      <th class="px-2 py-1 text-left">#</th>
      <th class="px-2 py-1 text-left">Avatar</th>
      <th class="px-2 py-1 text-left">Name</th>
      <th class="px-2 py-1 text-left">Email</th>
      <th class="px-2 py-1 text-left">Status</th>
      <th class="px-2 py-1 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    ${users.map((u, i) => `
      <tr>
        <td class="px-2 py-1">${i + 1}</td>
        <td class="px-2 py-1"><img src="${u.avatar_url || '/default-user.png'}" class="w-7 h-7 rounded-full border" /></td>
        <td class="px-2 py-1">${u.full_name}</td>
        <td class="px-2 py-1">${u.email}</td>
        <td class="px-2 py-1">${u.is_active ? "Active" : "Suspended"}</td>
        <td class="px-2 py-1">
          <button data-userid="${u.id}" class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded">View</button>
          <button data-userid="${u.id}" class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded">Suspend</button>
        </td>
      </tr>
    `).join("")}
  </tbody>
</table>
`;
export default UserTable;