import Link from 'next/link'
import React from 'react'
import { Button } from 'react-bootstrap'
import { globalPath } from 'src/global'

const Custom404 = () => {
  return (
    <main>
        <div className="container">
              <div className="box-404">
                <div className="img-wrapper">
                  <img src={`${globalPath.pathImg}/notfound.png`} alt="Not found" />
                </div>
                <div className="content">
                  <p className='fs-4'>Liên kết không tồn tại</p>
                  <Link href='/hoc-lieu'
                  >
                    <Button className='w-50 btn btn-danger text-secondary py-3 fs-2'>Quay về trang chủ</Button>
                  </Link>
                </div>
              </div>
            </div>
    </main>
  )
}

export default Custom404