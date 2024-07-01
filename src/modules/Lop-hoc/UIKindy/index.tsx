import { useEffect, useState } from "react";
import { COURSE_ID, MODE_SMART_CLASS } from "src/constant";
import { getDetailTeacher, getInfoCourse } from "src/services/common";
import ListBaiHoc from "../ListBaiHoc";
import DanhSachTaiLieuClassOffline from "../DanhSachTaiLieuClassOffline";
import Loading from "src/components/Loading";
import { useSchoolStore } from "../../../stores/schoolStore";

const UIKindy = (props: any) => {
    const { id, setCurrentUnit } = props;
    const [loading, setLoading] = useState(false);
    const [infoCourse, setInfoCourse] = useState<any>();
    const [teacherName, setTeacherName] = useState("N/A");
	const { schoolActive } = useSchoolStore((state: any) => ({
		schoolActive: state.schoolActive,
	}));
    const getDetailInfoCourse = () => {
        const params = {
            course_id: COURSE_ID,
            class_id: id,
        };
        setLoading(true);
        getInfoCourse(params)
            .then((res) => {
                if (res.meta.code === 200) {
                    setInfoCourse(res.result);
                    setLoading(false);
                    fetchTeacherName(res?.result?.teacher);
                } else {
                    setInfoCourse({});
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const fetchTeacherName = async (teacherId: number) => {
        getDetailTeacher({teacher_id:teacherId,school_id:schoolActive?.id}).then(res => {
            if (res?.code === 200) {
                setTeacherName(res?.data?.name)
            }

        }).catch(err => {
            console.log(err);

        })
    }

    useEffect(() => {
        getDetailInfoCourse();
    }, []);

    return (
        <div>
            {
                !loading ? (
                    infoCourse?.model === MODE_SMART_CLASS ? (
                        <ListBaiHoc idClassroom={id} infoCourse={infoCourse} teacherName={teacherName} />
                    ) : (
                        <DanhSachTaiLieuClassOffline
                            infoCourse={infoCourse}
                            loading={loading}
                            classId={id}
                            setCurrentUnit={setCurrentUnit}
                            teacherName={teacherName}
                        />
                    )
                ) : (
                    <Loading />
                )
            }
        </div>
    );
}
export default UIKindy;
