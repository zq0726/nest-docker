module.exports = {
  apps: [
    {
      name: 'nest_docker',
      script: 'dist/main.js',
      out_file: '/app/log/file.log', //日志文件
      error_file: '/app/log/file_error.log', //错误日志文件
      autorestart: true, //是否自动重启
      instances: 2, //要启动实例的数量即负载数量
    },
  ],
};
