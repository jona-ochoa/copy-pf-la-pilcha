"use client"
import React from "react";
import ResetPassword from "../../components/ResetPassword"

const ResetPasswordPage = ({token, id}) => {
    return (
        <div>
            <ResetPassword token={token} id={id} />
        </div>
    )
}

export const getServerSideProps = async(context) => {
    const token = context.query.token || null;
    return {
        props: {
            token,
        }
    }
}

export default ResetPasswordPage;
