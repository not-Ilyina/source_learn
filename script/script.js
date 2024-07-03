const { exec } = require('child_process');

// 定义一个函数来执行 Git 命令
function runGitCommand(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令时发生错误: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

runGitCommand('git log');
console.log('Hello world!');