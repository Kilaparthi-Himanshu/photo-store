/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mbmlqfwfupntapqyyrxy.supabase.co'
            }
        ]
    }
};

export default nextConfig;
