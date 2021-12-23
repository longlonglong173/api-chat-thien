import "./rightbar.css"
import { Users } from "../../dummyData";
import Online from "../online/Online";
// import Home
export default function Rightbar() {
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                <div className="birthdayContainer">
                    <img className="birthdayImg" src="assets/gift.png" alt="" />
                    <span className="birthdayText">
                        <b>Le Huyen Linh</b> and <b>have a birthday today   </b>
                    </span>
                </div>
                <img className="rightbarAd" src="assets/ad.png" alt="" />
                <h4 className="rightbarTitle">Online Friend</h4>
                <ul className="rightbarFriendList">
                   {Users.map(u =>(
                       <Online key = {u.id} user = {u}/>
                   ))}
                </ul>
            </div>
        </div>
    );
};



