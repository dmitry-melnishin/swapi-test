import React, {useEffect, useState} from "react";
import {setCurrentUser} from "../../helpers/set-current-user";
import "./fb-status.css";

export const FbStatus = () => {
    const [status, setStatus] = useState('');

    const statusChangeCallback = response => {
        if (response.status === 'connected') {
            FB.api('/me', function (response) {
                const userName = response.name;

                setCurrentUser(userName);
                setStatus(`Thanks for logging in, ${userName}!`)
            });
        } else {
            FB.login(function (response) {
                setStatus('Thanks for logging in!')
            }, {
                scope: 'email',
                return_scopes: true
            });

            setStatus('Please log into this app');
        }
    }

    useEffect(() => {
        FB?.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }, []);

    return <p className="status">Facebook Status: {status}</p>
};