import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Enter = () => {
    const [nickName, setNickName] = useState();
    const [certificate, setCertificate] = useState();

    const navigate = useNavigate();

    const submitCertificateNumber = () => {
        if (certificate === process.env.CERTIFICATE_NUMBER) navigate("/queue");
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