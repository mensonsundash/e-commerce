import { getFromStorage } from "../common/utils.js";
import { renderUsers } from "../common/admin-dom.js";

export let users = [];

function loadUsers() {
    const stored = getFromStorage("users", []);
    users = stored;
    console.log("USERS:", users)
}

function getFilteredUsers() {

    let filtered = [...users];
    const search = document.getElementById("searchInput").value;
    if(search) filtered = searchByKeyWords(filtered, search);

    renderUsers(filtered);

}

function searchByKeyWords(list, keywords) {
    const keywordsLower = keywords.toLowerCase();
    if(!Array.isArray(list) || !keywords) return list;

    return list.filter( u => {
        const userName = u.name.toLowerCase();
        const userRole = u.role.toLowerCase();

        return userName.includes(keywordsLower) || userRole.includes(keywordsLower);
    })
}

export { loadUsers, getFilteredUsers };