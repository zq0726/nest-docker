module.exports = {
  apps: [
    {
      name: 'nest_docker',
      script: 'dist/main.js',
      autorestart: true, //是否自动重启
      instances: 2, //要启动实例的数量即负载数量
      error_file: '/app/log/nest-error.log',
      out_file: '/app/log/nest-out.log',
      log_file: '/app/log/nest-combined.log',
      merge_logs: false, // 关键：禁用日志合并
    },
  ],
};
