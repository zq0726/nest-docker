module.exports = {
  apps: [
    {
      name: 'nest-docker',
      script: 'dist/main.js',
      instances: 2,
      autorestart: true,
      watch: false, // 生产环境关闭文件监控
      max_memory_restart: '1G',
      error_file: '/app/log/nest-error.log',
      out_file: '/app/log/nest-out.log',
      merge_logs: false,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'production',
      },
      uid: 'node', // 明确指定运行用户
    },
  ],
};
