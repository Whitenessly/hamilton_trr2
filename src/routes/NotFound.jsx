import React from 'react';
import { Link } from 'react-router'; // Lưu ý: Thường dùng 'react-router-dom' cho web

export default function NotFound() {
    return (
        <div className='w-screen h-screen bg-slate-900 flex flex-col items-center justify-center px-4'>
            {/* Tiêu đề lỗi 404 */}
            <h1 className='text-9xl font-extrabold text-white tracking-widest drop-shadow-lg'>
                404
            </h1>
            
            {/* Nhãn trang trí nổi bật */}
            <div className='bg-blue-500 text-white px-2 text-sm rounded rotate-12 absolute mt-[-100px] shadow-sm'>
                Page Not Found
            </div>

            {/* Thông báo lỗi */}
            <div className='mt-8 text-center'>
                <h2 className='text-3xl md:text-4xl font-semibold text-slate-100 mb-4'>
                    Ôi không! Bạn bị lạc rồi.
                </h2>
                <p className='text-slate-400 text-lg mb-8 max-w-lg mx-auto'>
                    Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc hiện tại không thể truy cập được.
                </p>
            </div>

            {/* Nút quay về trang chủ */}
            <Link 
                to="/home" 
                className='relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-900'
            >
                Về lại Trang chủ
            </Link>
        </div>
    );
}