import React from 'react'
import { useRouter } from 'next/router';
import useTrans from 'src/hooks/useTrans';

export default function Footer() {
  const router = useRouter();
  const trans = useTrans();
  const { locale } = router;

  return (
    <footer className="footer">
      <div className="container">

        <div className="d-flex flex-wrap info">
          <div className="mb-md-0 mb-4 ">
            <label className="company">
            {trans.footer.company}
            </label>
            {locale == "vi" && (
              <div className="d-flex align-items-center">
                <i className="fa fa-phone monkey-fz-24" />
                <a
                  rel="nofollow"
                  href="tel:1900 63 60 52"
                  className="monkey-f-header font-weight-bold monkey-fz-16 text-white ms-3"
                >
                  1900 63 60 52
                </a>
              </div>
            )}
          </div>
          {locale !== "en" && (
            <div className="col-right">
              <p className="fz-12 color-gray word-spacing">
                Giấy phép ĐKKD số 0106651756 do Sở Kế hoạch và Đầu tư TP Hà Nội
                cấp ngày 01/10/2014, thay đổi lần thứ 3 ngày 13/11/2020
              </p>
              <p className="fz-12 color-gray word-spacing mt-2">
                Trụ sở chính: Tầng 2, Tòa nhà FS, TTTM TNR Gold Season, số 47
                Nguyễn Tuân, P. Thanh Xuân Trung, Q. Thanh Xuân, TP. Hà Nội
              </p>
              <p className="fz-12 color-gray word-spacing mt-2">
                Người đại diện pháp luật: Ông Đào Xuân Hoàng - Nhà sáng lập
                &amp; Giám đốc điều hành
              </p>
            </div>
          )}
          {locale == "en" && <div className="ms-6">
            <p>
              Head Office: 8 The Green, Suite A, Dover, Delaware 19901, United
              States
            </p>
          </div>}
        </div>

        <div className="d-flex flex-wrap position-relative middle">
          <div className="col col1">
            <label className="nav-title">{trans.footer.about.intro}</label>
            <ul className="menu">
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }gioi-thieu`}
                  title=""
                >
                  {trans.footer.about.about}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }cau-chuyen-thuong-hieu`}
                  title=""
                >
                  {trans.footer.about.brand}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }giai-thuong`}
                  title=""
                >
                  {trans.footer.about.achivement}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }tin-tuc`}
                  title=""
                >
                  {trans.footer.about.news}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }lien-he`}
                  title=""
                >
                    {trans.footer.about.contact}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }tuyen-dung`}
                >
                  {trans.footer.about.careers}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }dieu-khoan-su-dung`}
                  title=""
                >
                  {trans.footer.about.terms}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }chinh-sach-bao-mat`}
                  title=""
                >
                  {trans.footer.about.policy}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }dai-ly`}
                  title=""
                >
                  {trans.footer.about.agent_registration}
                </a>
              </li>
            </ul>
          </div>
          <div className="col col2">
            <label className="nav-title">{trans.footer.products.title}</label>
            <ul className="menu">
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }san-pham/monkey-junior`}
                  title=""
                >
                   {trans.footer.products.MJ}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }san-pham/monkey-stories`}
                  title=""
                >
                   {trans.footer.products.MS}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }san-pham/monkey-math`}
                  title=""
                >
                    {trans.footer.products.MM}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }san-pham/vmonkey`}
                  title=""
                >
                    {trans.footer.products.VM}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }san-pham`}
                  title=""
                >
                  {trans.footer.products.MFull}
                </a>
              </li>
            </ul>
          </div>
          <div className="col col3">
            <label className="nav-title">{trans.footer.support.title}</label>
            <ul className="menu">
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }active-account`}
                  title=""
                >
                  {trans.footer.support.activate_account}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }huong-dan-hoc`}
                  title=""
                >
                  {trans.footer.support.tutorial}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }ho-tro-khach-hang`}
                  title=""
                >
                  {trans.footer.support.support}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }ho-tro-khach-hang`}
                  title=""
                >
                   {trans.footer.support.frequently_question}
                </a>
              </li>
              <li>
                <a
                  rel="nofollow"
                  target="_blank"
                  href="https://www.facebook.com/groups/donghanhcungconhocmonkey/about"
                  title=""
                >
                 {trans.footer.support.forum}
                </a>
              </li>
              <li>
                <a
                  href={`${
                    process.env.NODE_ENV !== "production"
                      ? process.env.NEXT_PUBLIC_WEB_URL
                      : ""
                  }huong-dan-thanh-toan`}
                  title=""
                >
                  {trans.footer.support.payment_guide}
                </a>
              </li>
              <li>
                <a href="https://hoc10.vn/" title="">
                  {trans.footer.support.list_book}
                </a>
              </li>
            </ul>
          </div>
          <div className="col col4">
            <div className="service">
              <p>{trans.footer.hotline.hotline_service}</p>
              <div className="d-flex flex-wrap box-btn">
                {locale == "vi" && <a rel="nofollow" href="tel:1900 63 60 52">
                  <i className="icon icon-phone"></i> 1900 63 60 52
                </a>}
                <a rel="nofollow" href="mailto:monkeyxinchao@monkey.edu.vn">
                  <i className="icon icon-mail"></i> { locale == "vi" ? "monkeyxinchao@monkey.edu.vn" : "support.global@monkeyenglish.net"}
                </a>
              </div>
              <span>{trans.footer.hotline.daily}</span>
            </div>
            <div className="social">
              <p>{trans.footer.hotline.connect}</p>
              <div className="social__list d-flex ">
                <a
                  rel="nofollow"
                  href="https://www.facebook.com/Monkey.edu.vn"
                  target="_blank"
                  title=""
                  className="facebook"
                >
                  facebook
                </a>
                <a
                  rel="nofollow"
                  href="https://www.youtube.com/channel/UCgJVidrhmAp0w_B0apM08OA"
                  target="_blank"
                  title=""
                  className="youtube"
                >
                  youtube
                </a>
              </div>
            </div>
            {locale == "vi" && <a
              href="//www.dmca.com/Protection/Status.aspx?ID=5d7dee04-b7ca-4a0a-9e06-f0daaab3093a"
              title="DMCA.com Protection Status"
              className="dmca-badge"
            >
              <img
                src="https://images.dmca.com/Badges/dmca_protected_16_120.png?ID=5d7dee04-b7ca-4a0a-9e06-f0daaab3093a"
                alt="DMCA.com Protection Status"
              />
            </a>}
            {locale == "vi" && <a
              rel="nofollow"
              href="http://online.gov.vn/Home/WebDetails/91089"
              className="fs-ftr-cthuong"
            >
              Đã thông báo
            </a>}
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="container d-flex">
          <div className="copyright">
            {trans.footer.copyright}
          </div>
          <div className="language navbar dropdown ml-auto"></div>
        </div>
      </div>
    </footer>
  );
}
