import React from "react";
import {useEffect} from "react";

const EditModal = ({ isShow, setIsShow }) => {

    useEffect(() => {
    }, [isShow]);

    return (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black/50">
            {/*<form onSubmit={}>*/}

            {/*</form>*/}
        </div>
    )
}

export default EditModal;