import Fetch from "../utils/Fetch";

const GENERAL_INFO = "v1/tutoring/overview";

const LOGIN_KINDY = "auth/login";
const SEND_EMAIL = "mail-to-data";

export const generalInfo = async (params: any) => {
  params = { ...params };

  const res: any = await Fetch.get<{
    data: {};
  }>(`${process.env.NEXT_PUBLIC_CRM_API_URL}${GENERAL_INFO}`, { params });

  if (res.status === "success") {
    return res.data;
  }
  return res.message;
};

export const getListHoclieu = async (params: any) => {
  params = { ...params };
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}levelsBy`,
    { params }
  );

  return res;
};

export const loginAccount = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}${LOGIN_KINDY}`,
    params
  );

  return res;
};

export const getInfoAccount = async (params: any) => {
  params = { ...params };
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_EDU_USER}v1/get-meta-info`,
    { params }
  );

  return res;
};

export const loginWithAdmin = async (params: any) => {
	const res:any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER}v1/auth/login-with-admin`,
		params
	);
	
	return res;
}

export const getInfoAccountAdmin = async (params: any) => {
	params = { ...params };
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER}v1/get-meta-info-admin`,
		{ params }
	);
	
	return res;
};

export const getTypeAccount = async (params: any) => {
  params = { ...params };
  const res: any = await Fetch.get<{}>(
      `${process.env.NEXT_PUBLIC_API_USER_KINDY}auth/get-type-account`,
      { params }
  );

  return res;
};

export const sendEmail = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_SEND_EMAIL}${SEND_EMAIL}`,
    params
  );

  return res;
};

export const getListClassroomSmart = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}classrooms`,
    { params }
  );

  return res;
};

// export const createClassroom = async (params: any) => {
//   const res: any = await Fetch.post<{

//   }>(`${process.env.NEXT_PUBLIC_API_CLASSROOM}classrooms`, params);

//   return res;
// }

export const getUnitLesson = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-schedule`,
    {params}
  );

  return res;
};

export const updateStatusLesson = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}update-status`,
    params
  );

  return res;
};

export const getListTeacher = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}teachers/get-list-by-params`,
    { params }
  );

  return res;
};

export const getListTeacherAndAdminSchoolBySchoolID = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}get-teacher-and-admin-school-by-school-id`,
		{ params }
	);
	
	return res;
};

export const getListTeacherV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_READER}v1/get-list-teacher-by-school-id`,
		{ params }
	);
	
	return res;
};

export const getListClassroom = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}classroom/get-list-by-params`,
    { params }
  );

  return res;
};
export const getListClassroomV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/classroom/get-list-by-params`,
		{ params }
	);
	
	return res;
};

export const getTotalClassroom = async (params: any) => {
  const res: any = await Fetch.get<{}>(
      `${process.env.NEXT_PUBLIC_API_CLASSROOM}get-total-classroom`,
      { params }
  );

  return res;
};

export const getTotalStudent = async (params: any) => {
  const res: any = await Fetch.get<{}>(
      `${process.env.NEXT_PUBLIC_API_CLASSROOM}get-total-student`,
      { params }
  );

  return res;
};
export const getTotalStudentV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/student/get-total-student`,
		{ params }
	);
	
	return res;
};

export const getDetailClassroom = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}classroom/get-detail-class`,
    { params }
  );

  return res;
};
export const getDetailClassroomV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/classroom/get-detail`,
		{ params }
	);
	
	return res;
};

export const createClassroom = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}classroom/create`,
    params
  );

  return res;
};

export const updateDetailClassroom = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}classroom/update`,
    params
  );

  return res;
};

export const updateDetailClassroomV2 = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/classroom/update`,
		params
	);
	
	return res;
};

export const getListStudent = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/get-list-by-params`,
    { params }
  );

  return res;
};
export const getListStudentV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_READER}v1/get-list-student-by-param`,
		{ params }
	);
	
	return res;
};
export const addMultipleStudentsV2 = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_USER_WRITER}v1/student`,
		params
	);
	
	return res;
};

export const getListStudentInClass = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/students/get-list-by-class-id`,
    { params }
  );

  return res;
};

export const changeClassroomStudent = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}change-classroom-student`,
    params
  );

  return res;
};
export const changeClassroomStudentV2 = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/classroom/change-student`,
		params
	);
	
	return res;
};

export const getDetailStudent = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/get-detail`,
    { params }
  );

  return res;
};
export const getDetailStudentV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_READER}v1/get-student-detail`,
		{ params }
	);
	
	return res;
};

export const updateStudent = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/update?student_id=${params.studentId_update}`,
    params
  );

  return res;
};
export const updateStudentV2 = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_WRITER}v1/update-student`,
		params
	);
	
	return res;
};

export const getListSchool = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}schools`,
    params
  );

  return res;
};

export const deleteClassroom = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/classroom/delete`,
    { params }
  );

  return res;
};

export const getDetailTeacher = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_EDU_USER_READER}v1/get-teacher-detail`,
	  {params}
  );

  return res;
};
export const getDetailTeacherV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_READER}v1/get-teacher-detail`,
		params
	);
	
	return res;
};

export const updateTeacher = async (params: any) => {
  const res: any = await Fetch.patch<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}teacher/${params?.user_id}`,
    params
  );

  return res;
};
export const updateTeacherV2 = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_WRITER}v1/update-teacher`,
		params
	);
	
	return res;
};

export const updateUser = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_WRITER}v1/update-user`,
		params
	);
	
	return res;
};

export const createTeacher = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}teachers/create`,
    params
  );

  return res;
};

export const createTeacherv2 = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_WRITER}v1/teacher`,
		params
	);
	
	return res;
};

export const createAdminSchool = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_WRITER}v1/admin-school`,
		params
	);
	
	return res;
};


export const addStudentToClassroom = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/create`,
    params
  );

  return res;
};

export const deleteTeacher = async (params: any) => {
  const res: any = await Fetch.delete<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}teacher/${params.id}`
  );

  return res;
};
export const deleteTeacherInSchoolV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/delete-teacher-in-school?user_id=${params.id}&school_id=${params.school_id}`
	);
	
	return res;
};
export const deleteStudentInSchoolV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/student/delete-student-in-school?student_id=${params.id}&school_id=${params.school_id}&user_id=${params.user_id}`
	);
	
	return res;
};
export const deleteUserInSchoolV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/user/delete-user-in-school?user_id=${params.id}&school_id=${params.school_id}`
	);
	
	return res;
};

export const deleteStudent = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/delete`,
    { params }
  );

  return res;
};

export const deleteStudentFromClassroom = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/classroom/delete-student-in-classroom`,
    { params }
  );

  return res;
};

export const getListProvince = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CRM}get-list-city-by-parent-id-and-country-code`,
    { params }
  );

  return res;
};

export const getListDistrict = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CRM}get-list-city-by-parent-id-and-country-code`,
    { params }
  );

  return res;
};

export const getInfoSchool = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}schools/${params.id}`
  );

  return res;
};

export const loginAdminCms = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}auth/check_login`,
    { params }
  );

  return res;
};

export const getLevelByCourse = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-list-level-by-course`,
    { params }
  );

  return res;
};

export const getUnitByLevel = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-list-unit-by-params`,
    { params }
  );

  return res;
};

export const getLessonByParams = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-lesson-by-params-v2`,
    { params }
  );

  return res;
};

export const getLessonByParamsV3 = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-lesson-by-params-v3`,
    { params }
  );

  return res;
};

export const getDetailLesson = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-lesson-detail`,
    { params }
  );

  return res;
};

export const getInfoCourse = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/get-course-info`,
    { params }
  );

  return res;
};

export const getTotalTeacher = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}get-total-teacher`,
    { params }
  );

  return res;
}
export const getTotalTeacherV2 = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/teacher/get-total-teacher`,
		{ params }
	);
	
	return res;
}

export const getAllTeacherSchoolAndMK = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}get-teacher-monkey-school`,
    { params }
  );

  return res;
}

export const getAllSchool = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_KINDY}get-all-school`,
    { params }
  );

  return res;
}

export const getListCourse = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-course-list`,
    { params }
  );

  return res;
}

export const getListCourseByAccount = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-course-list-by-account`,
    { params }
  );

  return res;
}

export const getListCourses = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_URL_KINDY}get-all-courses`,
    { params }
  );

  return res;
}

export const getCourseRegister = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/get-course-list-by-class-id`,
    { params }
  );

  return res;
}

export const getListHomework= async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}list-home-work-by-class-id`,
    { params }
  );

  return res;
}

export const progressHomework= async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}get-process-student`,
    { params }
  );

  return res;
}

export const deleteActivityHomework= async (params: any) => {

  const res: any = await Fetch.delete<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}delete-home-work/${params.id}`,
  );

  return res;
}

export const getDetailHomework= async (params: any) => {

  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}detail-home-work/${params.id}`,
  );

  return res;
}
export const editHomework= async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}edit-homework/${params.id}`,
    params 
  );

  return res;
}

export const getListClassroomAssignHomework = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}get-class-to-assign-homework`, {params}
  );

  return res;
}

export const createAssignHomeworkClassrooms = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}create-homework`, params
  );

  return res;
}

export const getLearningLessons = async (params: any) => {
  const res: any = await Fetch.get<{}>(
      `${process.env.NEXT_PUBLIC_API_CLASSROOM}list-learning-lesson-by-class-id`,
      { params }
  );

  return res;
};

export const updateStatusLearningLesson = async (params: any) => {
  const res: any = await Fetch.post<{}>(
      `${process.env.NEXT_PUBLIC_API_CLASSROOM}update-status-learning-lesson`,
       params
  );

  return res;
};

export const getModelIDByClassCourse = async (params: any) => {
  const res: any = await Fetch.get<{}>(
      `${process.env.NEXT_PUBLIC_API_CLASSROOM}get-model-id-by-class-course`,
      {params}
  );

  return res;
};

export const getListTeacherNotAssigned = async (params: any) => {
  const res: any = await Fetch.get<{}>(
      `${process.env.NEXT_PUBLIC_API_CLASSROOM}get-list-teacher-not-assigned-by-school-id`,
      {params}
  );

  return res;
};

export const getActExercise = async (params: any) => {
  const res: any = await Fetch.get<{}>(
      `https://question.monkeyuni.net/api/get-activity-by-book-content-id?book_content_id=${params.book_content_id}&level=${params.level}&activity_ids=${params.activity_ids}&game_id=${params.game_id}`,
      {params}
  );

  return res;
};

export const getListQuestion = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `https://question.monkeyuni.net/api/v1/list-question?`,
    {params}
  );

  return res;
}
// Attendence
export const getListAttendence = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}list-attendance`,
    {params}
  );

  return res;
}
export const getListAttendenceByStudent = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}list-attendance-by-student`,
    {params}
  );

  return res;
}

export const addMultipleStudents = async (params: any) => {
  const res: any = await Fetch.post<{}>(
      `${process.env.NEXT_PUBLIC_API_USER_KINDY}add-multiple-students`,
       params
  );

  return res;
};
export const importStudentByExcel = async (params: any) => {
  const res: any = await Fetch.post<{}>(
      `${process.env.NEXT_PUBLIC_API_USER_KINDY}students/import-by-excel`,
       params
  );

  return res;
};
export const importStudentByExcelV2 = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_WRITER}v1/students/import-by-excel`,
		params
	);
	
	return res;
};

export const getOtpSignUp = async (params: any) => {
  const res:any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_EDU_USER}v1/auth/login-class-mobile-with-otp`,
     params
  );

  return res;
}

export const signInWithPhone = async (params: any) => {
  const res:any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_EDU_USER}v1/auth/login-class-mobile-with-otp`,
     params
  );

  return res;
}

export const verifyOtp = async (params: any) => {
  const res:any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_EDU_USER}v1/auth/verify-otp-login`,
     params
  );

  return res;
}

export const getListSchoolName = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/school/get-list-school-name`,
    params
  );

  return res;
};

export const createAccountSchool = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/school/create`,
    params
  );

  return res;
};

export const getInfoDetailSchool = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/school/get-detail-school`,
    {params}
  );

  return res;
};

export const requestJoinToSchool = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}request-join-to-school`,
    params
  );

  return res;
};

export const registerAccount = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_WRITER}v1/register-with-otp`,
    params
  );

  return res;
};

export const verifyAccountOtp = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_USER_WRITER}v1/register-verify-otp`,
    params
  );

  return res;
};

export const createClassroomInSchool = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/classroom/create`,
    params
  );

  return res;
};

export const getListNotification = async (params: any) => {
  const res: any = await Fetch.get<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/notification/get-list`,
    {params}
  );

  return res;
};

export const acceptRequestJoinSchool = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}update-status-request-join-to-school`,
    params
  );

  return res;
};

export const sendNotiRequestJoinSchool = async (params: any) => {
  const res: any = await Fetch.post<{}>(
    `${process.env.NEXT_PUBLIC_API_CLASSROOM}update-time-request`,
    params
  );

  return res;
};

export const getListRoleForTeacher = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_EDU_USER_READER}v1/get-list-role-for-teacher`,
		{params}
	);
	
	return res;
}

export const getListClassroomBySchoolID = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}get-list-classroom-by-school-id`,
		{params}
	);
	
	return res;
}

export const getListUserRequestJoinSchool = async (params: any) => {
	const res: any = await Fetch.get<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}list-request-join-to-school`,
		{params}
	);
	
	return res;
}

export const updateReadNotification = async (params: any) => {
	const res: any = await Fetch.post<{}>(
		`${process.env.NEXT_PUBLIC_API_CLASSROOM}v2/notification/update-read`,
		params
	);
	
	return res;
}
