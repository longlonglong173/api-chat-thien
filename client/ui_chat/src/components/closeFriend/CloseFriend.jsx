import "./closeFriend.css"

export default function CloseFriend({user}) {
    return (
        <li className="sidebarFriend">
            <img className="slidebarFriendImg" src={user.profilePicture} alt="" />
            <span className="slidebarFriendName">{user.username}</span>
        </li>
    )
}
