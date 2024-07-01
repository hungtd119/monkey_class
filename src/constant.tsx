export interface LessonDoneProps {
	lessonName: string;
	time: number;
	timeLine: string;
	topicDone: string;
	story: string;
}

export const TYPE_TAI_LIEU_GUI_TRUOC = 1;
export const TYPE_LESSON_PLAN = 2;
export const TYPE_LESSON_PLAN_WORKSHEET = 3;
export const TYPE_VIDEO_HOC_LIEU = 8;
export const TYPE_SONG = 4;
export const TYPE_CHANT = 5;
export const TYPE_STORY = 6;

export const COURSE_ID = 109;
export const COURSE_ID_TUTORING = 68;
export const APP_ID = 69;

export const ATTENDANCE = 2;
export const DEFAULT_SESSIONS_REGISTER = 48;

export const MONDAY = 1;
export const TUESDAY = 2;
export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const FRIDAY = 5;
export const SATURDAY = 6;
export const SUNDAY = 0;
export const TYPE_ACCOUNT_TEACHER = "Teacher";
export const TYPE_ACCOUNT_SCHOOL = "School";
export const TYPE_ACCOUNT_PARENTS = "Student";
export const TYPE_ACCOUNT_ADMIN = "Admin_Class";

export const STATUS_NOT_DONE = 0;
export const STATUS_DONE = 1;
export const NOT_VERIFY = 0;
export const VERIFIED = 1;

export const MODE_OFFFLINE_40 = 1;
export const MODE_OFFFLINE_55 = 2;
export const MODE_SMART_CLASS = 3;

export const LIST_DAY: any = {
	[MONDAY]: "Monday",
	[TUESDAY]: "Tuesday",
	[WEDNESDAY]: "Wednesday",
	[THURSDAY]: "Thursday",
	[FRIDAY]: "Friday",
	[SATURDAY]: "Saturday",
	[SUNDAY]: "Sunday",
};

export const LIST_DAY_ENG: any = {
	[MONDAY]: "monday",
	[TUESDAY]: "tuesday",
	[WEDNESDAY]: "wednesday",
	[THURSDAY]: "thursday",
	[FRIDAY]: "friday",
	[SATURDAY]: "saturday",
	[SUNDAY]: "sunday",
};

export const LIST_DAY_ENG_TEXT: any = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export const months = Array.from({ length: 12 }, (_, i) => {
	const monthIndex = (currentMonth - i + 12) % 12;
	const year = currentYear + Math.floor((currentMonth - i) / 12);
	const value = new Date(year, monthIndex).getTime() / 1000 + 3600;
	const label = `Tháng ${monthIndex + 1}/${year}`;
	return { value, label, index: monthIndex };
})

export const ALL = 0;
export const ABSENT = 1;
export const PRESENT = 2;
export const MISSING_DATA = 3;

export const statusAttendences = [
	{ value: 0, label: "Tất cả" },
	{ value: 1, label: "Vắng mặt" },
	{ value: 2, label: "Có mặt" },
	{ value: 3, label: "Thiếu dữ liệu" },
];

export const DATA_SCHOOL_SAMPLE = [
	{ id: 1, value: 1, label: "Truong ABC" },
	{ id: 2, value: 2, label: "Truong BCD" },
];

export const DATA_PACKAGES = [
	{ id: COURSE_ID, value: COURSE_ID, label: "Monkey Kindy" },
	{
		id: COURSE_ID_TUTORING,
		value: COURSE_ID_TUTORING,
		label: "Monkey Tutoring",
	},
];

export const LEARN_MODELS = [
	{ id: MODE_OFFFLINE_40, value: MODE_OFFFLINE_40, label: "Monkey Kindy Pro (40 phút)" },
	{ id: MODE_OFFFLINE_55, value: MODE_OFFFLINE_55, label: "Monkey Kindy Pro (55 phút)" },
	{ id: MODE_SMART_CLASS, value: MODE_SMART_CLASS, label: "Monkey Kindy" },
];

export const LEARN_MODELS_COLLAPSE = [
	{ id: MODE_SMART_CLASS, value: MODE_SMART_CLASS, label: "Monkey Kindy" },
]

export const levelDefault = [
	{ id: 20, value: 20, label: "Level 1" },
	{ id: 21, value: 21, label: "Level 2" },
	{ id: 22, value: 22, label: "Level 3" },
];

export const languageCountry: any = {
	vi: "VN",
	en: "EN",
	th: "TH",
};

export const countryFlag: any = {
	vi: "https://monkeymedia.vcdn.com.vn/upload/web/img_default/Vietnam_(VN).svg",
	en: "https://monkeymedia.vcdn.com.vn/upload/web/img_default/us-flag.jpg",
	th: "https://monkeymedia.vcdn.com.vn/upload/web/img_default/thailand.svg",
};

export const languages = [
	{
		code: "vi",
		key: "VN",
		name: "VietNam",
		flagUrl:
			"https://monkeymedia.vcdn.com.vn/upload/web/img_default/Vietnam_(VN).svg",
	},
	{
		code: "en",
		key: "EN",
		name: "EngLish",
		flagUrl:
			"https://monkeymedia.vcdn.com.vn/upload/web/img_default/us-flag.jpg",
	},
	// {
	//   code: "th",
	//   key: "TH",
	//   name: "ประเทศไทย",
	//   flagUrl:
	//     "https://monkeymedia.vcdn.com.vn/upload/web/img_default/thailand.svg",
	// },
];

export const TableFormDanhGia = {
	phase1: [
		{
			id: 1,
			name_input: "objective_1",
			objective: "Trẻ tập trung lắng nghe.",
			description: "Children listen to the teacher attentively.",
		},
		{
			id: 2,
			name_input: "objective_2",
			objective: "Trẻ hiểu được nội dung các tấm thẻ.",
			description:
				"Children understand the content of the big cards and small cards.",
		},
		{
			id: 3,
			name_input: "objective_3",
			objective:
				"Trẻ hiểu và có thể thực hiện các hành động với sự hướng dẫn của cô.",
			description:
				"Children understand and are able to do the actions with the teacher's instructions.",
		},
	],
	phase2: [
		{
			id: 1,
			name_input: "objective_1",
			objective: "Trẻ phát âm chuẩn các từ vựng được học.",
			description: "Children can pronounce vocabulary correctly.",
		},
		{
			id: 2,
			name_input: "objective_2",
			objective: "Trẻ hiểu được nội dung các tấm thẻ.",
			description:
				"Children understand the content of the big cards and small cards.",
		},
		{
			id: 3,
			name_input: "objective_3",
			objective: "Trẻ có thể đọc và hát học liệu theo cô.",
			description: "Children are able to sing or read along with the teacher.",
		},
		{
			id: 4,
			name_input: "objective_4",
			objective:
				"Trẻ có thể dựa vào hướng dẫn của giáo viên để tham gia các hoạt động vận động.",
			description:
				"Children can follow the teacher's instruction to participate in action activities.",
		},
		{
			id: 5,
			name_input: "objective_5",
			objective:
				"Trẻ dùng từ đơn lẻ để trả lời các câu hỏi về nội dung của học liệu.",
			description:
				"Children respond with short answers based on the content of the songs, chants and the stories.",
		},
	],
	phase3: [
		{
			id: 1,
			name_input: "objective_1",
			objective: "Trẻ nhớ và sử dụng được từ vựng đã học.",
			description: "Children can memorize and use vocabulary.",
		},
		{
			id: 2,
			name_input: "objective_2",
			objective: "Trẻ nhớ được nội dung của các bài hát, vè và truyện.",
			description: "Children memorize the songs, chants, and stories.",
		},
		{
			id: 3,
			name_input: "objective_3",
			objective:
				"Trẻ có thể dùng các câu hoàn chỉnh để hỏi đáp về nội dung đã học.",
			description:
				"Children can use full sentences to talk about the content of songs, chants, stories.",
		},
		{
			id: 4,
			name_input: "objective_4",
			objective: "Trẻ có thể áp dụng và mở rộng học liệu.",
			description:
				"Children can apply and extend the content of songs, chants, stories.",
		},
	],
};

export const RangeAge = [
	{ id: 1, value: 24, label: "12-24 tháng" },
	{ id: 2, value: 23, label: "2-3 tuổi" },
	{ id: 3, value: 20, label: "3-4 tuổi" },
	{ id: 4, value: 21, label: "4-5 tuổi" },
	{ id: 4, value: 22, label: "5-6 tuổi" },
	{ id: 5, value: 25, label: "Lớp 1" },
	{ id: 6, value: 26, label: "Lớp 2" },
	{ id: 7, value: 27, label: "Lớp 3" },
	{ id: 8, value: 28, label: "Lớp 4" },
	{ id: 9, value: 29, label: "Lớp 5" },

];

export const MODE_CREATE = 1;
export const MODE_EDIT = 2;
export const TYPE_TEACHER_SCHOOL = 1;
export const TYPE_TEACHER_MONKEY = 2;
export const LIST_TYPE_TEACHER = [
	{ value: TYPE_TEACHER_SCHOOL, label: "Giáo viên trường" },
	{ value: TYPE_TEACHER_MONKEY, label: "Giáo viên Monkey" },
]

export const SUBJECT_DEFAULT = [
	{
		value: 109,
		label: "Monkey Kindy",
	},
	{
		value: 112,
		label: "Âm nhạc",
	},
];

export const LEARNING_LESSON_ACTIVE = 1;
export const LEARNING_LESSON_INACTIVE = 0;

export const LESSON_OF_40 = 32;
export const LESSON_OF_55 = 24;

export const MALE = 1;
export const FEMALE = 0;
export const TYPE_TEACHER = 1;
export const TYPE_ADMIN = 2;

export const GENDER: any = {
	[MALE]: "Nam",
	[FEMALE]: "Nữ"
}

export const TYPE_PARENT = [
	{value: MALE, label: "Thầy"},
	{value: FEMALE, label: "Cô"}
]

export const TYPE_ROLE = [
	{value: TYPE_ACCOUNT_TEACHER, label: "Giáo viên"},
	{value: TYPE_ACCOUNT_SCHOOL, label: "Quản trị viên"}
]

export const HTTP_STATUS_CODE_OK = 200;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
export const STATUS_ACCEPT = 1;
export const STATUS_REJECT = 2;
export const NOT_ACCEPT = 2;
export const ACCEPTED = 1;
export const PENDING_ACCEPTED = 0;

export const STATUS_LOCK = 0;
export const STATUS_UNLOCK = 1;
export const STATUS_DONE_LESSON = 2;

export const ROLE_TEACHER_NAME = "Giáo viên";
export const ROLE_SCHOOL_NAME = "Quản trị viên";

export const LIST_ROLE_NAME_FOR_TEACHER : any = {
	[TYPE_ACCOUNT_TEACHER]: ROLE_TEACHER_NAME,
	[TYPE_ACCOUNT_SCHOOL]: ROLE_SCHOOL_NAME
}
