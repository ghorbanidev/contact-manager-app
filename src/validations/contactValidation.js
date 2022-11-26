import * as Yup from 'yup';

export const contactSchema = Yup.object().shape({
    fullname: Yup.string().required("نام و نام خانوادگی الزامی میباشد"),
    photo: Yup.string().url("آدرس معتبر نیست").required("تصویر مخاطب الزامی می باشد"),
    mobile: Yup.number().required("شماره ی موبایل الزامی می باشد"),
    email: Yup.string().email("آدرس ایمیل معتبر نیست").required("آدرس ایمیل الزامی میباشد"),
    job: Yup.string().nullable(),
    group: Yup.string().required("انتخاب گروه الزامی می باشد")
})