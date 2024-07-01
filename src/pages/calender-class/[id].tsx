"use client";
import React from "react";
import Head from "next/head";
import Calender from "../../modules/Calender";
import Layout from "@layout/Layout";
const titlePage = "Calender";

const ViewCalenderClass
    = () => {

    return (
        <>
            <Layout>
                <Calender/>
            </Layout>
        </>
    );
};

export default ViewCalenderClass;