/**
 * @param {sweettooth.PublicUser} user 
 */
export function getProfileLink(user) {
    return `/profile/${user.id}`;
}