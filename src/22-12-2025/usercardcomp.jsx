import React, {Component} from "react";
import "../usercard.css"

class UserCard1 extends Component {
    render(){
        return(
            <div className="user-card user-card--small">
                <img className="avatar" src="https://cdn.cdnparenting.com/articles/2023/11/04194415/christmas-words-that-start-with-i.webp" alt="test" />
                <div className="user-card__info">
                    <h3 className="user-card__name">This is test</h3>
                </div>
                <div className="user-card__actions">
                    <button className="btn-primary">Save</button>
                </div>
            </div>
        );
    }
}

export default UserCard1;