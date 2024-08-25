const fs = require('fs');
const execSync = require('child_process').execSync;

// const mode = process.env.MODE;
const stackPath = process.env.STACK_PATH;

console.log(`Will update ${stackPath}`);
if (fs.existsSync(stackPath)) {
  console.log('Found File');
  // 执行命令docker compose pull
  let command = `docker compose -f ${stackPath} pull`;
  console.log(`Pulling Image: ${command}`);
  execSync(command, { stdio: 'inherit' });
  command = `docker compose -f ${stackPath} up -d`;
  console.log(`Recreate Container: ${command}`);
  execSync(command, { stdio: 'inherit' });
  console.log('Update Success');
  process.exit(0);
}
