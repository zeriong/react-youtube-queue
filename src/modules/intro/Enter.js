import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setAuthStorage} from "../../utils/common";

const Enter = () => {
    const [nickName, setNickName] = useState();
    const [certificate, setCertificate] = useState();

    const navigate = useNavigate();

    const submitCertificateNumber = () => {
        const isAdmin = certificate === process.env.CERTIFICATE_ADMIN;
        if (certificate === process.env.CERTIFICATE_NUMBER || isAdmin) {
            setAuthStorage(nickName, isAdmin);
            navigate("/queuePlayer");
        }
    }

    useEffect(() => {

    }, []);
    return (
        <div className="">
            메인이고 엔터임
        </div>
    )
}

export default Enter;