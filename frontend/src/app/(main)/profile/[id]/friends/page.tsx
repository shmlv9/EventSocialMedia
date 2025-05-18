import {fetchFriends, fetchFriendsRequests} from "@/lib/api/users/apiFriends"
import FriendsMenu from "@/components/profile/friends/FriendsMenu";

type FriendsPageProps = {
    params: {
        id: string
    }
}


export default async function FriendsPage({params}: FriendsPageProps) {
    const userId = params.id
    const friendsData = await fetchFriends(userId)
    const requestsData = await fetchFriendsRequests()
    return (
        <FriendsMenu id={userId} friendsData={friendsData.friends} requestsData={requestsData.requests}/>
    )
}
