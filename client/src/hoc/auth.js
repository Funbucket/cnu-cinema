import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from '../_actions/user_action'
import { useNavigate } from 'react-router-dom'; 

export default function (SpecificComponent, option, adminRoute = null) {
    // null => 아무나 출입 가능
    // true => 로그인 유저만 출입 가능
    // false => 로그인 유저 출입 불가능
    function AuthenticationCheck(props) {

        const dispatch = useDispatch();
        const navigate = useNavigate();
        useEffect(() => {
            dispatch(auth()).then(response => {
                if (!response.payload.isAuth) {
                    // 로그인아웃 상태
                    if (option) {
                        navigate('/login');
                    }
                } else {
                    // 어드민이 아닌데 어드민 페이지 접근시도
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate('/')
                    } else if (adminRoute && response.payload.isAdmin) {
                        // 어드민 페이지
                        navigate('/admin')
                    }
                    // 로그인 상태에서 로그인 페이지 접근시 
                    else {
                        if (option === false) {
                            navigate('/')
                        }
                    }
                }
            })
        }, [])
        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}