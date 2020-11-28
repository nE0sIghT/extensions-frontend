/**
 * @param {sweettooth.PublicUser} user 
 */
export function getProfileLink(user) {
    return `/accounts/profile/${user.id}`;
}