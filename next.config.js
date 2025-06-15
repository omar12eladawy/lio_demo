/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8003/api/:path*"
            ,
      },
      {
        source: "/docs",
        destination: "http://127.0.0.1:8003/docs"
      },
      {
        source: "/openapi.json",
        destination:"http://127.0.0.1:8003/openapi.json"
      },
    ];
  },
};

module.exports = nextConfig;
