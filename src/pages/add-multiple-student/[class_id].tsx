import React from 'react';
import Head from "next/head";
import Layout from "@layout/Layout";
import ThongTinHocSinh from "../../modules/Hocsinh/ThongtinHocSinh";
import AddMultipleStudentForm from "../../AddMultipleStudentForm";

const AddMultipleStudent = () => {
	return (
		<>
			<Head>
				<title>Thêm học sinh</title>
				<meta name="description" content="Thêm học sinh" />
			</Head>
			<Layout>
				<AddMultipleStudentForm />
			</Layout>
		</>
	);
};

export default AddMultipleStudent;
