module.exports = {
  apps: [
    {
      name: 'nest-docker',
      script: 'dist/main.js',
      instances: 2,
      autorestart: true,
      watch: false, // 生产环境关闭文件监控
      max_memory_restart: '1G',
    },
  ],
};
