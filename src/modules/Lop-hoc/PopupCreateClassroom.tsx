import { nunito } from "@styles/font";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Image from "next/image";
import { globalPath } from "../../global";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select, { components } from "react-select";
import { levelDefault, RangeAge } from "../../constant";
import SelectCus from "../../components/SelectCus";

interface FormValues {
	class_name: string | null;
	age: string | null;
	teacher_ids: [] | null;
}

const schema               = yup
	.object ()
	.shape ({
		class_name  : yup.string ().required ("Vui lòng nhập tên lớp"),
		age         : yup.string ().required ("Vui lòng nhập độ tuổi"),
		teacher_ids : yup.array ()
	})
	.required ();
const PopupCreateClassroom = (props: any) => {
	const {show, handleClose, data, onSubmit} = props;
	const {
		      control,
		      handleSubmit,
		      reset,
		      formState : {errors},
		      register,
	      }                                   = useForm<FormValues> ({
		mode          : "onChange",
		resolver      : yupResolver (schema),
		defaultValues : {
			class_name  : "",
			age         : "",
			teacher_ids : []
		},
	});
	const CustomOption                        = (props: any) => {
		const {src} = props.data
		return (
			<components.Option { ...props }>
				<Image className={ "me-2" } src={ src ? src : `${ globalPath.pathImg }/avatar_random2.png` } alt={ "avatar" }
				       width={ 32 }
				       height={ 32 }/>
				{ props.children }
			</components.Option>
		);
	};
	const CustomMutiValueLabel                = (props: any) => {
		const {src} = props.data
		return (
			<components.MultiValueLabel { ...props }>
				<Image className={ "me-2" } src={ src ? src : `${ globalPath.pathImg }/avatar_random2.png` } alt={ "avatar" }
				       width={ 32 }
				       height={ 32 }/>
				{ props.children }
			</components.MultiValueLabel>
		);
		
	}
	return (
		<Modal
			show={ show }
			onHide={ handleClose }
			centered
			backdrop="static"
			keyboard={ false }
			size={ "lg" }
			className={ nunito.className }
		>
			<Modal.Header closeButton className="border-0">
				<div className={ "d-flex align-items-center" }>
					<div className={ "me-4 p-3 rounded-4" } style={ {border : "1px solid #EAECF0"} }>
						<Image src={ `${ globalPath.pathSvg }/file-plus-03.svg` } alt={ "file" } width={ 32 } height={ 32 }/>
					</div>
					<div>
						<div className={ "h5 fw-bold" }>Tạo lớp học</div>
						<div className={ "h6" }>Thiết lập và quản lí các lớp học mới một cách dễ dàng</div>
					</div>
				</div>
			</Modal.Header>
			<hr className={ "m-0" } style={ {border : "1px solid #ccc"} }/>
			<Modal.Body>
				<div className={ "d-flex row" }>
					<Col lg={ 12 } md={ 12 } sm={ 12 }>
						<Form.Group as={ Row } className="mb-3 fw-bold">
							<Col lg={ 3 } md={ 12 } sm={ 12 }>
								<Form.Label htmlFor="classroom_name">
									Tên lớp học <span>*</span>
								</Form.Label>
							</Col>
							<Col lg={ 9 } md={ 12 } sm={ 12 }>
								<Form.Control
									autoFocus
									{ ...register ("class_name") }
									aria-label="class_name"
									className="input-custom custom-input"
									placeholder="Ví dụ: Lớp Bí Ngô"
								/>
								
								{ errors.class_name?.message && (
									<p className="mt-2 text-danger-v2">
										{ errors.class_name?.message as any }
									</p>
								) }
							</Col>
						</Form.Group>
					</Col>
					
					<Col lg={ 12 } md={ 12 } sm={ 12 }>
						<Form.Group as={ Row } className="mb-3 fw-bold">
							<Col lg={ 3 } md={ 12 } sm={ 12 }>
								<Form.Label
									htmlFor={ `age` }
								>
									Độ tuổi <span>*</span>
								</Form.Label>
							</Col>
							<Col lg={ 9 } md={ 12 } sm={ 12 }>
								<Controller
									name="age"
									rules={ {required : true} }
									render={ ({field : {onChange, value}}) => (
										<Select
											placeholder={ "Chọn" }
											options={ RangeAge }
											// value={value}
											onChange={ (selectedOption: any) => {
												onChange (selectedOption ? selectedOption.value : ""); // Use an empty string or null based on your requirements
											} }
											styles={ {
												control : (baseStyles, state) => ( {
													...baseStyles,
													borderRadius : "12px",
													padding      : "9px 12px",
													fontWeight   : "600",
												} ),
											} }
										/>
									) }
									control={ control }
								/>
								{ errors?.age?.message && (
									<p className="mt-2 text-danger fw-medium" style={ {fontStyle : "italic"} }>
										{ errors?.age?.message }
									</p>
								) }
							</Col>
						</Form.Group>
					</Col>
				</div>
				<hr className={ "m-0" } style={ {border : "1px solid #ccc"} }/>
				<div className={ "d-flex row mt-4" }>
					<Col lg={ 12 } md={ 12 } sm={ 12 }>
						<Form.Group as={ Row } className="mb-3 fw-bold">
							<Col lg={ 3 } md={ 12 } sm={ 12 }>
								<Form.Label htmlFor="classroom_name">
									Ảnh đại diện
								</Form.Label>
							</Col>
							<Col lg={ 9 } md={ 12 } sm={ 12 }>
								<div className={ "d-flex justify-content-between" }>
									<div>
										<div className={ "rounded-50 p-5" } style={ {border : "1px solid #ccc", backgroundColor:"#F2F4F7"} }>
											<Image src={ `${ globalPath.pathSvg }/image-plus.svg` } alt={ "image" } width={ 32 }
											       height={ 32 }/>
										</div>
									</div>
									<div className={ "rounded-4 py-6 px-8" } style={ {border : "1px solid #EAECF0"} }>
										<div className={ "h6" }>
											<span className={ "h6 fw-bold" } style={ {color : "#1570EF"} }>Bấm để chọn file tải
											                                                               lên</span> hoặc kéo và thả
										</div>
										<div className={ "text-center fw-lighter " } style={ {fontSize : "14px"} }>
											PNG hoặc JPG ( tối đa 800px x 800px )
										</div>
									</div>
								</div>
							
							</Col>
						</Form.Group>
					</Col>
				</div>
				<hr className={ "m-0" } style={ {border : "1px solid #ccc"} }/>
				<div className={ "d-flex row my-4" }>
					<Col lg={ 12 } md={ 12 } sm={ 12 }>
						<Form.Group as={ Row } className="mb-3 fw-bold">
							<Col lg={ 3 } md={ 12 } sm={ 12 }>
								<Form.Label htmlFor="classroom_name">
									Giáo viên
								</Form.Label>
							</Col>
							<Col lg={ 9 } md={ 12 } sm={ 12 }>
								<Select
									options={ [
										{value : 1, label : "Nguyễn Văn A", src : `${ globalPath.pathImg }/avatar_random1.png`},
										{value : 2, label : "Nguyễn Văn B"},
										{value : 3, label : "Nguyễn Văn C"},
									] }
									isMulti
									defaultValue={ [] }
									placeHolder={ "Chọn giáo viên" }
									onChange={ (e: any) => console.log (e) }
									styles={ {
										control    : (baseStyles, state) => ( {
											...baseStyles,
											borderRadius : "12px",
											padding      : "9px 12px",
											fontWeight   : "600",
										} ),
										multiValue : (baseStyles, state) => ( {
											...baseStyles,
											borderRadius    : "12px",
											backgroundColor : "white",
											border          : "1px solid #ccc",
											padding         : "2px"
										} ),
									} }
									components={ {Option : CustomOption, MultiValueLabel : CustomMutiValueLabel} }
								/>
							</Col>
						</Form.Group>
					</Col>
				</div>
				<hr className={ "m-0" } style={ {border : "1px solid #ccc"} }/>
			</Modal.Body>
			<Modal.Footer className="border-0">
				<div className={ "d-flex row w-100" }>
					<Col lg={ 6 }>
						<Button className={ "p-3 w-100 border-info-v2 fw-bold" } onClick={ handleClose }>
							Hủy
						</Button>
					
					</Col>
					<Col lg={ 6 }>
						<Button className={ "p-3 text-white w-100 fw-bold" } variant="primary-v2" type="submit"
						        onClick={ () => onSubmit () }>
							Tạo lớp học
						</Button>
					</Col>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default PopupCreateClassroom;
