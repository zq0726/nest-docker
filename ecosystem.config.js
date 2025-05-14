module.exports = {
  apps: [
    {
      name: 'nest_docker',
      script: 'dist/main.js',
      error_file: '/dev/stdout',
      out_file: '/dev/stdout',
      log_file: '/dev/stdout', // 强制所有日志输出到控制台
      autorestart: true, //是否自动重启
      instances: 2, //要启动实例的数量即负载数量
    },
  ],
};
