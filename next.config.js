const path      = require('path')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  // basePath: '/phu-huynh',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  eslint: {
    ignoreDuringBuilds: true  // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
  },
  images: {
    domains: [
      "monkeymedia.vcdn.com.vn",
      "monkeymedia2020.s3.ap-southeast-1.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "monkeymedia.vcdn.com.vn",
        port: "",
        pathname: "/upload/web/**",
      },
      {
        protocol: "https",
        hostname: "monkeymedia2020.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "vnmedia2.monkeyuni.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vnmediadev.monkeyuni.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    localeDetection: false,
  },
  
  publicRuntimeConfig: {
	  NEXT_PUBLIC_APP_API_URL         : process.env.NEXT_PUBLIC_APP_API_URL,
	  NEXT_PUBLIC_CRM_API_URL         : process.env.NEXT_PUBLIC_CRM_API_URL,
	  NEXT_PUBLIC_APP_API_URL_LOGIN   : process.env.NEXT_PUBLIC_APP_API_URL_LOGIN,
	  NEXT_PUBLIC_WEB_URL             : process.env.NEXT_PUBLIC_WEB_URL,
	  NEXT_PUBLIC_SENTRY_DSN          : process.env.NEXT_PUBLIC_SENTRY_DSN,
	  NEXT_PUBLIC_API_USER_KINDY      : process.env.NEXT_PUBLIC_API_USER_KINDY,
	  NEXT_PUBLIC_API_SEND_EMAIL      : process.env.NEXT_PUBLIC_API_SEND_EMAIL,
	  NEXT_PUBLIC_API_URL_KINDY       : process.env.NEXT_PUBLIC_API_URL_KINDY,
	  NEXT_PUBLIC_API_CLASSROOM       : process.env.NEXT_PUBLIC_API_CLASSROOM,
	  NEXT_PUBLIC_API_EDU_USER_READER : process.env.NEXT_PUBLIC_API_EDU_USER_READER,
	  NEXT_PUBLIC_API_EDU_USER_WRITER : process.env.NEXT_PUBLIC_API_EDU_USER_WRITER,
    NEXT_PUBLIC_API_EDU_USER        : process.env.NEXT_PUBLIC_API_EDU_USER,
	  NEXT_PUBLIC_API_CRM             : process.env.NEXT_PUBLIC_API_CRM,
    NEXT_PUBLIC_CDN_MEDIA_URL       : process.env.NEXT_PUBLIC_CDN_MEDIA_URL,
    NEXT_PUBLIC_URL_WEBSOCKET       : process.env.NEXT_PUBLIC_URL_WEBSOCKET

  }
}

module.exports = nextConfig
